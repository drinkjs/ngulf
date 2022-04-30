// import * as dotenv from "dotenv";
import IORedis from "ioredis";
import { MongoConnectionOptions } from "../common/Mongoer";
import { DataSourceOptions } from "typeorm";
import { FastifyServerOptions } from "fastify";
import { Constructor } from "../core";

// dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// const staticPath = process.env.STATIC_PATH || `${process.cwd()}/public`;
// console.info(staticPath.bgBlue);

export interface NgulfOptions extends FastifyServerOptions {
  routePrefix?: string;
  websocket?: boolean;
  mongo?: MongoConnectionOptions;
  orm?: DataSourceOptions;
  redis?: IORedis.RedisOptions;
  controllers?: Constructor<any>[];
}

// export interface IStaticConfig {
//   readonly staticPrefix: string;
//   readonly staticPath: string;
//   readonly libPath: string;
// }

// export const defaultStaticConfig: IStaticConfig = {
//   staticPrefix: "/public/",
//   staticPath, // 所有静态文件存放访目录，用户上传的图片也存在这，生产环境建议放在cdn或nginx下
//   libPath: process.env.LIBS_PATH || `${staticPath}/libs`, // 组件上传后存放的目录，生产环境建议放在cdn或nginx下
// };

// const defaultConfig: NgulfOptions = {
// websocket: false,
// mongo: {
//   uris: "mongodb://localhost:27017/",
//   options: {
//     dbName: "mojito",
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: false,
//     serverSelectionTimeoutMS: 5000,
//     bufferCommands: false,
//     useFindAndModify: false,
//   },
// },
// orm: {
//   type: "mysql",
//   host: "localhost",
//   port: 3306,
//   username: "root",
//   password: "2012131417",
//   database: "shoes",
//   entityPrefix: "shoes_",
//   entities: [
//     // eslint-disable-next-line node/no-path-concat
//     `${__dirname}/src/entity/*{.ts,.js}`,
//   ],
//   synchronize: false,
// },
// redis: {
//   host: "127.0.0.1",
//   port: 6379,
//   keyPrefix: "shoes:",
// },
// };
