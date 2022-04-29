import { FastifyInstance } from "fastify";
import Router from "../core/Router";
import { NgulfOptions } from "../config";
import Mongoer from "../common/Mongoer";
import Ormer from "../common/Ormer";
import Rediser from "../common/Rediser";
import plugin from "../plugin";
import hooks from "../hooks";

export default async function loader(
  fastify: FastifyInstance,
  opts?: NgulfOptions,
  callBack?: {
    onBindBefore?: (server: FastifyInstance) => Promise<any>;
    onBind?: (server: FastifyInstance) => Promise<any>;
  }
) {
  await plugin(fastify, opts);
  await hooks(fastify, opts);

  if (callBack?.onBindBefore) {
    // 路由绑定前调用
    await callBack.onBindBefore(fastify);
  }

  Router.getInstance(fastify, opts);

  if (callBack?.onBind) {
    // 路由绑定后调用
    await callBack.onBind(fastify);
  }

  if (opts?.mongo) {
    Mongoer.getInstance().inject(opts.mongo);
  }
  if (opts?.orm) {
    Ormer.getInstance().inject(opts.orm);
  }
  if (opts?.redis) {
    Rediser.getInstance().inject(opts.redis);
  }
}
