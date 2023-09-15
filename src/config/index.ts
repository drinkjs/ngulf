import * as http2 from "http2";
import * as https from "https";
import {
	FastifyHttp2Options,
	FastifyHttpsOptions,
	FastifyInstance,
	FastifyServerOptions,
} from "fastify";
import { Constructor } from "../core";

export type NgulfBaseOptions = {
  port?: number;
  routePrefix?: string;
  websocket?: boolean;
  controllers: Constructor<any>[] | string;
  plugin?: (fastify: FastifyInstance, opts?: NgulfBaseOptions) => Promise<any>;
  hook?: (fastify: FastifyInstance, opts?: NgulfBaseOptions) => Promise<any>;
  inject?: (fastify: FastifyInstance, opts?: NgulfBaseOptions) => Promise<any>;
};

export type NgulfHttpOptions = NgulfBaseOptions & FastifyServerOptions;

export type NgulfHtt2Options = NgulfBaseOptions &
  FastifyHttp2Options<http2.Http2Server>;

export type NgulfHttsOptions = NgulfBaseOptions &
  FastifyHttpsOptions<https.Server>;
