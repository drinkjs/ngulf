import { getModelForClass } from "@typegoose/typegoose";
import mongoose, { Connection } from "mongoose";
import { MG_MODEL_METADATA, MongoMetaObj } from "../core/decorator/metaKeys";

export interface MongoConnectionOptions {
  uris: string;
  options: mongoose.ConnectOptions;
}

export default class Mongoer {
	static instance: Mongoer;

	static create() {
		if (!Mongoer.instance) {
			Mongoer.instance = new Mongoer();
		}
		return Mongoer.instance;
	}

	static getCurrInstance() {
		return Mongoer.instance;
	}

	private connections: Map<string, Connection> = new Map();

	async addConnect(opts: MongoConnectionOptions) {
		const conn = mongoose.createConnection(opts.uris, opts.options);
		if (conn) {
			this.connections.set(opts.uris, conn);
			console.log(`${opts.uris} connected`.green);
		} else {
			throw new Error(`${opts.uris} connect error`.red);
		}
		return conn;
	}

	async inject(mongoOpts: MongoConnectionOptions) {
		// 注入mongoose Model
		const services: any[] = Reflect.getMetadata(MG_MODEL_METADATA, MongoMetaObj);
		if (services) {
			for (const service of services) {
				const { key, target, model, options } = service;
				if (target[key]) {
					return;
				}
				const opts: MongoConnectionOptions = options || mongoOpts;
				const conn = this.connections.has(opts.uris)
					? this.connections.get(opts.uris)
					: await this.addConnect(opts);
				target[key] = getModelForClass(model, {
					existingConnection: conn || undefined,
				});
			}
		}
	}
}

/**
 * 自定义验证objectId装饰器
 * @param property
 * @param validationOptions
 */
// export function IsObjectId (validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: {
//         validate (value: any) {
//           return mongoose.Types.ObjectId.isValid(value);
//         },
//       },
//     });
//   };
// }
