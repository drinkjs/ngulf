// import * as dotenv from "dotenv";
import { RedisOptions } from "ioredis";
import { MongoConnectionOptions } from "../common/Mongoer";
import { DataSourceOptions } from "typeorm";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import { Constructor } from "../core";

// dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// const staticPath = process.env.STATIC_PATH || `${process.cwd()}/public`;

export interface NgulfOptions extends FastifyServerOptions {
  routePrefix?: string;
  websocket?: boolean;
  mongo?: MongoConnectionOptions;
  orm?: DataSourceOptions;
  redis?: RedisOptions;
  controllers?: Constructor<any>[];
  plugin?: (fastify: FastifyInstance, opts?: NgulfOptions) => Promise<any>;
  hooks?: (fastify: FastifyInstance, opts?: NgulfOptions) => Promise<any>;
  http2?: boolean;
}
