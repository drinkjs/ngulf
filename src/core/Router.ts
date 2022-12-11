import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AppError from "../common/AppError";
import {
  getInject,
  INJECT_METADATA,
  IocFactory,
} from "./decorator/IocDecorator";
import {
  CONTROLLER_METADATA,
  PARAM_METADATA,
  ROUTE_METADATA,
  ParamType,
} from "./decorator/RouterDecorator";
import { WebsocketEmitter } from "./WebsocketEmitter";
import { NgulfOptions } from "../config";
import { RouterContext } from "../";

export default class Router {
  private server: FastifyInstance;

  private wss: WebsocketEmitter | undefined;

  private allRoute: Record<string, string[]> = {};

  private opts?: NgulfOptions;

  // eslint-disable-next-line no-use-before-define
  static instance: Router;

  static create(server: FastifyInstance, opts?: NgulfOptions) {
    if (!Router.instance) {
      Router.instance = new Router(server, opts);
    }

    return Router.instance;
  }

  constructor(serverInstance: FastifyInstance, opts?: NgulfOptions) {
    this.server = serverInstance;
    this.opts = opts;
    if (opts?.websocket) {
      this.wss = new WebsocketEmitter();
    }
  }

  bind() {
    // ioc方式生成controller
    this.opts?.controllers?.forEach((controller) => {
      const instance = IocFactory(controller);
      const controllerMetadata: string = Reflect.getMetadata(
        CONTROLLER_METADATA,
        controller
      );
      const proto = Object.getPrototypeOf(instance);
      // 拿到该实例的原型方法
      const routeNameArr = Object.getOwnPropertyNames(proto).filter(
        (n) => n !== "constructor" && typeof proto[n] === "function"
      );

      const currRoutes: string[] = [];
      routeNameArr.forEach((routeName) => {
        const routeMetadata: any = Reflect.getMetadata(
          ROUTE_METADATA,
          proto[routeName]
        );
        if (!routeMetadata) return;

        const { type, path } = routeMetadata;
        // const self = selfish(instance);
        const selfFun = instance[routeName].bind(instance);
        const urlPath =
          typeof path === "string"
            ? `${this.opts?.routePrefix || ""}` + controllerMetadata + path
            : path;

        currRoutes.push(urlPath);
        // webaocket事件
        if (this.wss && type === "ws") {
          this.wss.on(urlPath, selfFun);
          return;
        }

        const handler = this.handlerFactory(
          selfFun,
          Reflect.getMetadata(PARAM_METADATA, instance, routeName)
        );
        // 绑定路由
        this.server.route({
          method: type.toUpperCase(),
          url: urlPath,
          // onRequest: this.server.csrfProtection,
          handler,
        });
        console.info(`${type.toUpperCase()} ${urlPath}`.blue);
      });

      instance.__server__ = this.server;
      if (instance.__init__) {
        instance.__init__();
      }
      this.allRoute[controllerMetadata] = currRoutes;
    });

    if (this.wss) {
      this.wss.listen({ server: this.server.server });
    }

    // 解释@Inject
    const injects = Reflect.getMetadata(INJECT_METADATA, Router);
    injects?.forEach(({ key, target, type }: any) => {
      if (/^class[\s{]/.test(type.toString())) {
        target[key] = getInject(type);
      } else {
        target[key] = getInject(type());
      }
    });
  }

  /**
   * 生成路由处理方法
   * @param func
   * @param paramList
   */
  // eslint-disable-next-line no-unused-vars
  private handlerFactory(func: (...args: any[]) => any, paramList: any[]) {
    return async (req: FastifyRequest, res: FastifyReply) => {
      const ctx: RouterContext = { req, res };
      // 获取路由函数的参数
      const args = await this.extractParameters(ctx, paramList);

      const rel = await func(...args);
      if (rel !== undefined) {
        res.send(rel);
      }
    };
  }

  private async extractParameters(
    ctx: RouterContext,
    paramArr: ParamType[] = []
  ) {
    if (!paramArr.length) return [ctx];
    const { req } = ctx;

    const args: any[] = [];
    const checkArgs: any[] = [];
    for (const param of paramArr) {
      const { key, index, type, validator, paramType } = param;
      let obj;
      switch (type) {
        case "query":
          obj = req.query as any;
          args[index] = key && obj ? obj[key] : obj;
          break;
        case "body":
          obj = req.body as any;
          args[index] = key && obj ? obj[key] : obj;
          break;
        case "headers":
          obj = req.headers as any;
          args[index] = key && obj ? obj[key] : obj;
          break;
        case "uploadFile":
          obj = req as any;
          // eslint-disable-next-line no-await-in-loop
          args[index] = await obj.file();
          break;
        default:
          args[index] = undefined;
      }

      if (validator) {
        // 验证参数
        // eslint-disable-next-line no-await-in-loop
        checkArgs[index] = await validator.check(paramType, args[index]);
      } else {
        if (key && (args[index] === undefined || args[index] === "")) {
          AppError.assert(`${key} is empty`);
        }
        checkArgs[index] = args[index];
      }
    }

    checkArgs.push(ctx);
    return checkArgs;
  }

  getRoutes(controller?: string): string[] | undefined {
    if (controller) {
      return this.allRoute[controller];
    }
    const routes: string[] = [];
    Object.values(this.allRoute).forEach((v) => routes.push(...v));
    return routes;
  }
}
