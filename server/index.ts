/* eslint-disable no-unused-vars */
import "reflect-metadata";
import "colors";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { NgulfOptions } from "../config";
import loader from "./loader";

export default async function ngulf(
  opts?: NgulfOptions,
  callBack?: {
    onBindBefore?: (server: FastifyInstance) => Promise<any>;
    onBind?: (server: FastifyInstance) => Promise<any>;
  }
) {
  const server: FastifyInstance = Fastify({
    logger: opts?.logger,
  });
  try {
    await loader(server, opts, callBack);
    return server;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
