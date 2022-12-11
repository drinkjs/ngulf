import Ngulf from "./src";
import IndexController from "./__test__/controller/IndexController";

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: [IndexController],
  orm: {
    type: "mysql",
    port: 3306,
    host: "localhost",
    username: "root",
    password: "2012131417",
    database: "test",
    entityPrefix: "ng_",
    entities: [`${__dirname}/entity/*{.ts,.js}`],
    bigNumberStrings: false,
    synchronize: true, // 生产环境必需为false，否则可能会丢失数据
  },
});
app.listen({ port: 8787 });
