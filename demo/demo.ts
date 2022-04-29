import ngulf from "../";
import TextController from "./controller/TestController";

ngulf({
  routePrefix: "/api",
  controllers: [TextController],
}).then((server) => {
  server.listen(8787).then(() => {
    console.log("Ngulf listen on 8787");
  });
});
