import { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import session from "@fastify/session";

export default async function plugin(server: FastifyInstance) {
  await server.register(cookie);
  await server.register(session, {
    secret: "j3tkbSuaPrYPBJaJjnBh10G5IkdTmhQx",
    cookieName: "MAGICSESS",
    cookie: {
      secure: "auto",
      maxAge: 3600 * 1000,
    },
  });
}
