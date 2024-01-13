import path from "path";
import Ngulf from "../../dist";

const app = Ngulf.create({
	routePrefix: "/api",
	controllers: path.join(__dirname, "controller"),
	serverless: true,
});

app.bind();

export default app.server;
