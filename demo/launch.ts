import * as path from "path";
import Ngulf from "../src";
import plugin from "./plugin";

export const launch = () => {
  const app = Ngulf.create({
    routePrefix: "/api",
    controllers: path.join(__dirname, "controller"),
    orm: {
      type: "mysql",
      port: 3306,
      host: "localhost",
      username: "root",
      password: "2012131417",
      database: "test",
      entityPrefix: "ng_",
      entities: [path.join(__dirname, "entity/*{.ts,.js}")],
      bigNumberStrings: false,
      synchronize: true, // 生产环境必需为false，否则可能会丢失数据
    },
    // redis: {
    //   host: "127.0.0.1",
    //   port: 6379,
    //   keyPrefix: "test:",
    // },
    plugin,
  });
  app.listen({ port: 8787 }).then(() => {
    console.log("Ngulf listen on 8787");
  });
};
