import { FastifyInstance } from "fastify";
import { Mongoer, Ormer, Rediser } from "../common";
import { NgulfBaseOptions } from "../config";

export default async function plugin(
  server: FastifyInstance,
  opts?: NgulfBaseOptions
) {
  if (opts?.orm) {
    await Ormer.create().addConnect(opts?.orm);
  }
  if (opts?.redis) {
    await Rediser.create().addConnect(opts?.redis);
  }
  if (opts?.mongo) {
    await Mongoer.create().addConnect(opts.mongo);
  }
}
