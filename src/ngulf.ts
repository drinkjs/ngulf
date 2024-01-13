import Fastify, { FastifyInstance, FastifyListenOptions } from "fastify";
import * as fs from "fs";
import { NgulfHttpOptions, NgulfHtt2Options, NgulfHttsOptions } from "./config";
import plugin from "./plugin";
import hooks from "./hooks";
import Router from "./core/Router";
import { Constructor } from "./core";

export class Ngulf {
	private readonly options:
		| NgulfHttpOptions
		| NgulfHtt2Options
		| NgulfHttsOptions;

	private readonly _server!: FastifyInstance;

	constructor(options: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions);
	constructor(options: NgulfHttpOptions);
	constructor(options: NgulfHtt2Options);
	constructor(options: NgulfHttsOptions);
	constructor(options: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions) {
		this.options = options;
		if (!options) {
			this._server = Fastify();
		} else if ((options as NgulfHtt2Options).http2) {
			// http2
			// this._server = Fastify({
			//   // logger: options?.logger as NgulfHttsOptions["logger"],
			//   http2: true,
			//   http2SessionTimeout: (options as NgulfHtt2Options).http2SessionTimeout,
			// });
		} else if ((options as NgulfHttsOptions).https !== undefined) {
			// https
			this._server = Fastify({
				// logger: options?.logger as NgulfHttpOptions["logger"],
				https: (options as NgulfHttsOptions).https,
			});
		} else {
			// http
			this._server = Fastify({
				logger: options?.logger as NgulfHttpOptions["logger"],
			});
		}
	}

	static create(
		options: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions
	) {
		const app = new Ngulf(options);
		return app;
	}

	static createHttps() {}

	static createHttp2() {
		Fastify({
			logger: true,
			http2: true,
		});
	}

	get server() {
		return this._server;
	}

	async bind() {
		let controllers: Constructor<any>[] = [];
		if (Array.isArray(this.options.controllers)) {
			controllers = this.options.controllers;
		} else {
			const files = fs.readdirSync(this.options.controllers, {
				withFileTypes: true,
			});
			for (const file of files) {
				if (file.isFile() && file.name.match(/Controller\.(ts|js)$/)) {
					const fileName = file.name.replace(/\.(ts|js)/, "");
					const controller = await import(
						`file://${this.options.controllers}/${file.name}`
					);
					if (controller) {
						controllers.push(controller.default || controller[fileName]);
					}
				}
			}
		}

		// 系统插件
		await plugin(this.server, this.options);
		// 外部插件
		if (this.options.plugin) {
			await this.options.plugin(this.server);
		}
		// 系统hooks
		await hooks(this.server, this.options);
		// 外部hooks
		if (this.options.hook) {
			await this.options.hook(this.server, this.options);
		}
		// 注册路由
		Router.create(this.server, this.options).bind(controllers);

		// 外部状饰器
		if (this.options.inject) {
			await this.options.inject(this.server, this.options);
		}
	}

	async listen(params: FastifyListenOptions) {
		try {
			await this.bind();
			await this.server.listen(params);
		} catch (err) {
			setTimeout(() => {
				process.exit(1);
			}, 500);
			throw err;
		}
	}
}
