/* eslint-disable no-unused-vars */
import "reflect-metadata";
import "colors";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { NgulfOptions } from "./config";
import loader from "./loader";
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

  async listen(port: number | string, address?: string, backlog?: number) {
    try {
      await loader(this.server, this.options);
      await this.server.listen(port, address, backlog);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

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
