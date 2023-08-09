/* eslint-disable no-unused-vars */
import "reflect-metadata";
import "colors";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Ngulf } from "./ngulf";
import { Mongoer, Ormer, Rediser } from "./common";
export * from "./config";
export * from "./controller/BaseController";
export * from "./core";
export * from "./common";

export default Ngulf;
export interface RouterContext {
  req: FastifyRequest;
  res: FastifyReply;
  server: FastifyInstance;
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
