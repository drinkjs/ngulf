import mongoose, { Connection } from "mongoose";
import { ReturnModelType, getModelForClass } from "@typegoose/typegoose";

export * from "@typegoose/typegoose";
export * as mongoose from "mongoose";

export type Constructor<T = any> = new (...args: any[]) => T;
export interface MongoConnectionOptions {
	uris: string;
	options: mongoose.ConnectOptions;
}

const MOGO_MODEL_METADATA = Symbol.for("mogo_model_metadata");
const MongoMetaObj = {};

export type MongoModel<T> = ReturnModelType<Constructor<T>>;

export function Mongo(
	model: Constructor,
	options?: MongoConnectionOptions
): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
			Reflect.getMetadata(MOGO_MODEL_METADATA, MongoMetaObj) || [];
		const newMetadata = [{ key, target, model, options }, ...preMetadata];
		Reflect.defineMetadata(MOGO_MODEL_METADATA, newMetadata, MongoMetaObj);
	};
}

const connections: Map<string, Connection> = new Map();

export async function connect(opts: MongoConnectionOptions) {
	const conn = mongoose.createConnection(opts.uris, opts.options);
	if (conn) {
		connections.set(opts.uris, conn);
		console.log(`${opts.uris} connected`);
	} else {
		throw new Error(`${opts.uris} connect error`);
	}
	return conn;
}

export async function inject(mongoOpts: MongoConnectionOptions) {
	// 注入mongoose Model
	const services: any[] = Reflect.getMetadata(
		MOGO_MODEL_METADATA,
		MongoMetaObj
	);
	if (services) {
		for (const service of services) {
			const { key, target, model, options } = service;
			if (target[key]) {
				return;
			}
			const opts: MongoConnectionOptions = options || mongoOpts;
			const conn = connections.get(opts.uris) ?? (await connect(opts));
			target[key] = getModelForClass(model, {
				existingConnection: conn || undefined,
			});
		}
	}
}
