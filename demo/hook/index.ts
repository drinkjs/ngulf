import { FastifyInstance } from "fastify";
export default async function hook(server: FastifyInstance) {
  // 异常处理
  server.setErrorHandler((error, request, reply) => {
    reply.send({
      code: 500,
      msg: error.message,
    });
  });

  server.addHook("onRequest", async (request, reply) => {});
}
