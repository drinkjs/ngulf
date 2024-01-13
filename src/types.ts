import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export interface RouterContext {
	request: FastifyRequest;
	reply: FastifyReply;
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