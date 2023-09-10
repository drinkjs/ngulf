import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "../common/AppError";
import {
	CONTROLLER_METADATA,
	PARAM_METADATA,
	ROUTE_METADATA,
	INJECT_METADATA,
	ParamType,
	Constructor,
	getInject,
	IocFactory,
	RouterMetaObj
} from "./decorator";
import { WebsocketEmitter } from "./WebsocketEmitter";
import { NgulfBaseOptions } from "../config";
import { RouterContext } from "../types";
import { z } from "zod";
import { Validation } from "./Validation";

type initCallback = () => void;

export default class Router {
	private server: FastifyInstance;

	private wss: WebsocketEmitter | undefined;

	private allRoute: Record<string, string[]> = {};

	private opts?: NgulfBaseOptions;

	static instance: Router;

	private initFuns: initCallback[] = [];

	static create(server: FastifyInstance, opts?: NgulfBaseOptions) {
		if (!Router.instance) {
			Router.instance = new Router(server, opts);
		}

		return Router.instance;
	}

	constructor(serverInstance: FastifyInstance, opts?: NgulfBaseOptions) {
		this.server = serverInstance;
		this.opts = opts;
		if (opts?.websocket) {
			this.wss = new WebsocketEmitter();
		}
	}

	bind(controllers: Constructor[]) {
		// ioc方式生成controller
		controllers.forEach((controller) => {
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
				if (this.wss && type === "WSS") {
					// webaocket事件
					this.wss.on(urlPath, selfFun);
					if (typeof urlPath === "string") {
						console.info(`WSS ${urlPath}`.blue);
					}
				} else {
					// http
					const paramsMetaData = Reflect.getMetadata(
						PARAM_METADATA,
						instance,
						routeName
					);
					const handler = this.handlerFactory(selfFun, paramsMetaData);
					// 绑定路由
					this.server.route({
						method: type,
						url: urlPath,
						schema: this.parseSchema(paramsMetaData),
						// 不使用默认验证器
						validatorCompiler: () => {
							return (data) => data;
						},
						handler,
					});
					console.info(`${type} ${urlPath}`.blue);
				}
			});

			instance.__server__ = this.server;
			if (instance.__init__) {
				this.initFuns.push(instance.__init__.bind(instance));
			}
			this.allRoute[controllerMetadata] = currRoutes;
		});

		if (this.wss) {
			this.wss.listen({ server: this.server.server });
		}

		// 解释@Inject
		const injects = Reflect.getMetadata(INJECT_METADATA, RouterMetaObj);
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
	private handlerFactory(
		func: (...args: unknown[]) => unknown,
		paramList: ParamType[]
	) {
		return async (req: FastifyRequest, res: FastifyReply) => {
			const ctx: RouterContext = { req, res, server: this.server };
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
				if (validator instanceof Validation) {
					checkArgs[index] = await validator.check(paramType, args[index]);
				} else if (validator instanceof z.ZodType) {
					const parse = validator.safeParse(args[index]);
					if (parse.success) {
						checkArgs[index] = parse.data;
					} else {
						const errMsg = parse.error.errors.map((v) => v.message);
						ValidationError.assert(errMsg.join("\n"));
					}
				}
			} else {
				if (key && (args[index] === undefined || args[index] === "")) {
					ValidationError.assert(`${key} is empty`);
				}
				checkArgs[index] = args[index];
			}
		}

		checkArgs.push(ctx);
		return checkArgs;
	}

	private parseSchema(paramArr: ParamType[] = []) {
		const schemas: Record<string, any> = {};
		for (const param of paramArr) {
			const { schema, type } = param;
			if (schema) {
				schemas[type] = Object.assign(schemas[type] || {}, schema);
			}
		}
		return schemas;
	}

	getRoutes(controller?: string): string[] | undefined {
		if (controller) {
			return this.allRoute[controller];
		}
		const routes: string[] = [];
		Object.values(this.allRoute).forEach((v) => routes.push(...v));
		return routes;
	}

	callInitFuns() {
		this.initFuns.forEach((fun) => {
			fun();
		});
		this.initFuns = [];
	}
}
