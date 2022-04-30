import Ngulf from "../dist";
import TextController from "./controller/TestController";

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: [TextController],
});

app.listen(8787).then(() => {
  console.log("Ngulf listen on 8787");
});
