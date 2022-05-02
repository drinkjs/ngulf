import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AppError from "../common/AppError";
import { IocFactory } from "./decorator/IocDecorator";
import {
  CONTROLLER_METADATA,
  PARAM_METADATA,
  ROUTE_METADATA,
  ParamType,
} from "./decorator/RouterDecorator";
import { WebsocketEmitter } from "./WebsocketEmitter";
import { NgulfOptions } from "../config";
import { RouterContext } from "../";

// function selfish(target: any) {
//   const cache = new WeakMap();
//   const handler = {
//     get(self: any, key: any) {
//       const value = Reflect.get(self, key);
//       if (typeof value !== "function") {
//         return value;
//       }
//       if (!cache.has(value)) {
//         cache.set(value, value.bind(self));
//       }
//       return cache.get(value);
//     },
//   };
//   const proxy = new Proxy(target, handler);
//   return proxy;
// }
export default class Router {
  private server: FastifyInstance;

  private wss: WebsocketEmitter | undefined;

  // eslint-disable-next-line no-use-before-define
  static instance: Router;

  static create(app: FastifyInstance, opts?: NgulfOptions) {
    if (!Router.instance) {
      Router.instance = new Router(app, opts);
    }

    return Router.instance;
  }

  constructor(serverInstance: FastifyInstance, opts?: NgulfOptions) {
    this.server = serverInstance;

    if (opts?.websocket) {
      this.wss = new WebsocketEmitter();
    }

    // ioc方式生成controller
    opts?.controllers?.forEach((controller) => {
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
            ? `${opts.routePrefix || ""}` + controllerMetadata + path
            : path;
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
    });

    if (this.wss) {
      this.wss.listen({ server: serverInstance.server });
    }
  }

  /**
   * 生成路由处理方法
   * @param func
   * @param paramList
   */
  // eslint-disable-next-line no-unused-vars
  handlerFactory(func: (...args: any[]) => any, paramList: any[]) {
    return async (req: FastifyRequest, res: FastifyReply) => {
      const ctx: RouterContext = { req, res };
      // 获取路由函数的参数
      const args = await this.extractParameters(ctx, paramList);

      const rel = await func(...args);
      res.send(rel);
    };
  }

  async extractParameters(ctx: RouterContext, paramArr: ParamType[] = []) {
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
          AppError.assert(`${key}不能为空`);
        }
        checkArgs[index] = args[index];
      }
    }

    checkArgs.push(ctx);
    return checkArgs;
  }
}
