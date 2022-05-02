// import * as dotenv from "dotenv";
import IORedis from "ioredis";
import { MongoConnectionOptions } from "../common/Mongoer";
import { DataSourceOptions } from "typeorm";
import { FastifyServerOptions } from "fastify";
import { Constructor } from "../core";

// dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// const staticPath = process.env.STATIC_PATH || `${process.cwd()}/public`;

export interface NgulfOptions extends FastifyServerOptions {
  routePrefix?: string;
  websocket?: boolean;
  mongo?: MongoConnectionOptions;
  orm?: DataSourceOptions;
  redis?: IORedis.RedisOptions;
  controllers?: Constructor<any>[];
}

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
