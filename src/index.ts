/* eslint-disable no-unused-vars */
import "reflect-metadata";
import "colors";
import Fastify, {
  FastifyInstance,
  FastifyListenOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { NgulfHttpOptions, NgulfHtt2Options, NgulfHttsOptions } from "./config";
import plugin from "./plugin";
import hooks from "./hooks";
import Router from "./core/Router";
import { Mongoer, Ormer, Rediser } from "./common";
export * from "./config";
export * from "./controller/BaseController";
export * from "./core";
export * from "./common";
export interface RouterContext {
  req: FastifyRequest;
  res: FastifyReply;
}

export interface HttpResult<T> {
  code: number;
  msg?: string;
  data?: T;
}

export type PromiseRes<T> = Promise<HttpResult<T>>;

export interface ExceptionFilter {
  catch: (error: Error, ctx: RouterContext) => any;
}

export default class Ngulf {
  private readonly options?:
    | NgulfHttpOptions
    | NgulfHtt2Options
    | NgulfHttsOptions;

  private readonly _server: FastifyInstance;

  constructor(options?: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions);
  constructor(options: NgulfHttpOptions);
  constructor(options: NgulfHtt2Options);
  constructor(options: NgulfHttsOptions);
  constructor(
    options?: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions
  ) {
    this.options = options;
    if (!options) {
      this._server = Fastify();
    } else if ((options as NgulfHtt2Options).http2) {
      // http2
      this._server = Fastify({
        logger: options?.logger as NgulfHttsOptions["logger"],
        http2: true,
      });
    } else if ((options as NgulfHttsOptions).https !== undefined) {
      // https
      this._server = Fastify({
        logger: options?.logger as NgulfHttpOptions["logger"],
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
    options?: NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions
  ) {
    return new Ngulf(options);
  }

  get server() {
    return this._server;
  }

  async listen(params: FastifyListenOptions) {
    try {
      // 系统插件
      await this.server.register((fastify, options, done) => {
        plugin(fastify, this.options).then(() => {
          done();
        });
      });
      // 外部插件
      if (this.options?.plugin) {
        await this.server.register((fastify, options, done) => {
          this.options?.plugin &&
            this.options.plugin(fastify, this.options).then(() => {
              done();
            });
        });
      }
      // 系统hooks
      await this.server.register((fastify, options, done) => {
        hooks(fastify, this.options).then(() => {
          done();
        });
      });
      // 外部hooks
      if (this.options?.hooks) {
        await this.server.register((fastify, options, done) => {
          this.options?.hooks &&
            this.options.hooks(fastify, this.options).then(() => {
              done();
            });
        });
      }
      // 注册路由
      await this.server.register(async (fastify, options, done) => {
        Router.create(fastify, this.options).bind();
        if (this.options?.orm) {
          // 注入typeorm
          await Ormer.create().inject(this.options?.orm);
        }
        if (this.options?.redis) {
          // 注入ioredis
          await Rediser.create().inject(this.options?.redis);
        }
        if (this.options?.mongo) {
          // 注入mongo
          await Mongoer.create().inject(this.options?.mongo);
        }
        done();
      });

      await this.server.listen(params);
      return true;
    } catch (err) {
      setTimeout(() => {
        process.exit(1);
      }, 2000);
      throw err;
    }
  }
}
