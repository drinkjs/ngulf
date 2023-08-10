import path from "path";
import { fileURLToPath } from "url";
import Ngulf, {
  NgulfHtt2Options,
  NgulfHttpOptions,
  NgulfHttsOptions,
} from "../src";
import plugin from "./plugin";
import hook from "./hook";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function launch(options?: { port?: number }) {
  const app = Ngulf.create({
    routePrefix: "/api",
    controllers: path.join(__dirname, "controller"),
    plugin,
    hook,
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
      synchronize: true, // 生产环境必需为false，否则会丢失数据
    },
    mongo: {
      // see https://mongoosejs.com/
      uris: "mongodb://127.0.0.1:27017",
      options: {
        dbName: "ngulf_test",
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        autoIndex: false,
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
        // useFindAndModify: false,
      },
    },
    // redis: {
    //   host: "127.0.0.1",
    //   port: 6379,
    //   keyPrefix: "test:",
    // },
  });
  await app.listen({ port: options?.port ?? 8787 }).then(() => {
    console.log(`Ngulf listen on ${options?.port ?? 8787}`);
  });
}
