import { FastifyInstance } from "fastify";
import { NgulfOptions } from "../config";
import Mongoer from "../common/Mongoer";
import Ormer from "../common/Ormer";
import Rediser from "../common/Rediser";
import hooks from "../hooks";

export default async function loader(
  fastify: FastifyInstance,
  opts?: NgulfOptions
) {
  await hooks(fastify, opts);

  if (opts?.orm) {
    await Ormer.getInstance().addConnect(opts.orm);
  }
  if (opts?.redis) {
    await Rediser.getInstance().addConnect(opts?.redis);
  }
  if (opts?.mongo) {
    await Mongoer.getInstance().addConnect(opts.mongo);
  }

  if (opts?.mongo) {
    await Mongoer.getInstance().inject(opts.mongo);
  }
  if (opts?.orm) {
    await Ormer.getInstance().inject(opts.orm);
  }
  if (opts?.redis) {
    await Rediser.getInstance().inject(opts.redis);
  }
}
