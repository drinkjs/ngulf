/* eslint-disable no-use-before-define */
import { DataSourceOptions, DataSource } from "typeorm";
import { ORM_MODEL_METADATA } from "../core/decorator/ServiceDecorator";

export default class Ormer {
  static instance: Ormer;

  static getInstance() {
    if (!Ormer.instance) {
      Ormer.instance = new Ormer();
    }
    return Ormer.instance;
  }

  dataSources: Map<string, DataSource> = new Map();

  async addConnect(options: DataSourceOptions) {
    const appDataSource = new DataSource(options);
    const ds = await appDataSource.initialize().catch((err) => {
      throw err;
    });
    this.dataSources.set(options.name, ds);
    // here you can start to work with your database
    const connectOptions: any = options;
    console.log(
      `${options.type}@${connectOptions?.host}:${connectOptions?.port} connected`
        .green
    );
    return ds;
  }

  async inject(ormOpts: DataSourceOptions) {
    // 注入orm repository
    const services: any[] = Reflect.getMetadata(ORM_MODEL_METADATA, Ormer);
    if (services) {
      for (const service of services) {
        const { key, target, entity, options } = service;
        if (target[key]) {
          return;
        }
        const opts = options || ormOpts;
        if (!opts.name) {
          opts.name = "default";
        }
        const connection = this.dataSources.has(opts.name)
          ? this.dataSources.get(opts.name)
          : await this.addConnect(opts);
        if (connection) {
          target[key] = connection.getRepository(entity);
        }
      }
    }
  }
}
