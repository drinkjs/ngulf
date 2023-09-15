import path from "path";
import { fileURLToPath } from "url";
import Ngulf, {
  NgulfHtt2Options,
  NgulfHttpOptions,
  NgulfHttsOptions,
} from "../src";
import plugin from "./plugin";
import hook from "./hook";
import inject from "./inject";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function launch(options?: { port?: number }) {
  const app = Ngulf.create({
    routePrefix: "/api",
    controllers: path.join(__dirname, "controller"),
    plugin,
    hook,
    inject,
  });
  await app.listen({ port: options?.port ?? 8787 }).then(() => {
    console.log(`Ngulf listen on ${options?.port ?? 8787}`);
  });
}
