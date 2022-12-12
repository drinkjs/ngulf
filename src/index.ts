/* eslint-disable no-unused-vars */
import "reflect-metadata";
import "colors";
import Fastify, {
  FastifyInstance,
  FastifyListenOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { NgulfOptions } from "./config";
import plugin from "./plugin";
import hooks from "./hooks";
import Router from "./core/Router";
import { Ormer, Rediser } from "./common";
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
  private options?: NgulfOptions;
  private _server: FastifyInstance;

  constructor(options?: NgulfOptions) {
    this.options = options;
    this._server = Fastify({
      logger: options?.logger,
    });
  }

  static create(options?: NgulfOptions) {
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
