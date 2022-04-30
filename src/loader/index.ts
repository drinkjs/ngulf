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
  opts?: NgulfOptions
) {
  await plugin(fastify, opts);
  await hooks(fastify, opts);

  Router.getInstance(fastify, opts);

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
