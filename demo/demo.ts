import Ngulf from "../dist";
import TextController from "./controller/TestController";

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: [TextController],
  redis: {
    host: "127.0.0.1",
    port: 6379,
    keyPrefix: "shoes:",
  },
});

app.listen(8787).then(() => {
  console.log("Ngulf listen on 8787");
});
