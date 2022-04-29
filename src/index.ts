/// <reference path="../node_modules/mongoose/types/index.d.ts" />

import fastify, { FastifyReply, FastifyRequest } from "fastify";
import IORedis from "ioredis";
import ngulf from "./server";

export default ngulf;

export { fastify, IORedis };
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
