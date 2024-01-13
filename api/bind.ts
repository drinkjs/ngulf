import "reflect-metadata";
import {
	CONTROLLER_METADATA,
	ROUTE_METADATA,
	PARAM_METADATA,
} from "../src/core/decorator/metaKeys";
import { IocFactory } from "../src/core";
import path from "path";
import fs from "fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export type Constructor<T = any> = new (...args: any[]) => T;

// console.log("--------------", process.cwd());

const controllerPath = path.join(process.cwd(), "/demo/controller");

console.log("==============", controllerPath);

const controllers:any[] = [];

async function readController() {
	const files = fs.readdirSync(controllerPath, {
		withFileTypes: true,
	});
	for (const file of files) {
		if (file.isFile() && file.name.match(/Controller\.(ts|js)$/)) {
			const fileName = file.name.replace(/\.(ts|js)/, "");
			const controller = await import(
				`file://${controllerPath}/${file.name}`
			);
			if (controller) {
				controllers.push(controller.default || controller[fileName]);
			}
		}
	}
	bind(controllers);
}


function bind(controllers: Constructor[]) {
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

			const { path } = routeMetadata;
			// const self = selfish(instance);
			// const selfFun = instance[routeName].bind(instance);
			const urlPath = controllerMetadata + path;
			currRoutes.push(urlPath);

			// http
			const paramsMetaData = Reflect.getMetadata(
				PARAM_METADATA,
				instance,
				routeName
			);

			console.log("========", urlPath, paramsMetaData);

			// const handler = this.handlerFactory(selfFun, paramsMetaData);
			// 绑定路由
			// this.server.route({
			// 	method: type,
			// 	url: urlPath,
			// 	schema: this.parseSchema(paramsMetaData),
			// 	// 不使用默认验证器
			// 	validatorCompiler: () => {
			// 		return (data) => data;
			// 	},
			// 	handler,
			// });
		});
	});
}


readController();