import { FastifyInstance } from "fastify";
// import fastifyMultipart from "fastify-multipart";
// import fastifyStatic from "fastify-static";
import { NgulfOptions } from "../config";
// import fastifyCookie from "fastify-cookie";
// import fastifySession from "fastify-session";
// import fastifyCsrf from "fastify-csrf";
// import fastifyNextjs from "fastify-nextjs";
// import { swagger } from 'src/config/swagger'

export default async function plugin(
  server: FastifyInstance,
  opts?: NgulfOptions
) {
  // 上传文件
  // await server.register(fastifyMultipart);
  // 静态目录
  // await server.register(fastifyStatic, {
  //   root: defaultStaticConfig.staticPath,
  //   prefix: defaultStaticConfig.staticPrefix,
  // });
  // 动态openapi
  // await server.register(require('fastify-swagger'), swagger);
  // 静态openapi
  // server.register(require('fastify-swagger'), {
  //   mode: 'static',
  //   specification: {
  //     path: './src/config/swagger.json'
  //   },
  //   exposeRoute: true
  // })
  // await server.register(fastifyCookie);
  // await server.register(fastifySession, {
  //   secret: defaultConfig.sessionSecret,
  // });
  // await server.register(fastifyCsrf, { sessionPlugin: "fastify-session" });
  // await server.register(fastifyNextjs, { dev: process.env.NODE_ENV !== "production" })
  // server.after(() => {
  //     server.next("/view");
  //   });
}
