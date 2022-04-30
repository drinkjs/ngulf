import Ngulf from "../dist";
import TextController from "./controller/TestController";
import HomeController from "./controller/HomeController";

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: [TextController, HomeController],
  // redis: {
  //   host: "127.0.0.1",
  //   port: 6379,
  //   keyPrefix: "shoes:",
  // },
  orm: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "shoes",
    entityPrefix: "shoes_",
    insecureAuth: true,
    entities: [
      // eslint-disable-next-line node/no-path-concat
      `${__dirname}/entity/*{.ts,.js}`,
    ],
    synchronize: true,
  },
});

app.listen(8787).then(() => {
  console.log("Ngulf listen on 8787");
});
