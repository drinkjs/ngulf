import { ReturnModelType } from "@typegoose/typegoose";
import { RedisOptions } from "ioredis";
import mongoose from "mongoose";
import { DataSourceOptions, ObjectLiteral, Repository } from "typeorm";
import { Constructor } from "./IocDecorator";
import { CacheMetaObj, CACHE_MODEL_METADATA, MG_MODEL_METADATA, MongoMetaObj, ORMMetaObj, ORM_MODEL_METADATA, WebsocketMetaObj, WSS_METADATA } from "./metaKeys";

export function MgModel(
	model: Constructor,
	options?: {uris: string; options: mongoose.ConnectOptions;}
): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata = Reflect.getMetadata(MG_MODEL_METADATA, MongoMetaObj) || [];
		const newMetadata = [{ key, target, model, options }, ...preMetadata];
		Reflect.defineMetadata(MG_MODEL_METADATA, newMetadata, MongoMetaObj);
	};
}

export function OrmModel(
	entity: Constructor,
	options?: DataSourceOptions
): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata = Reflect.getMetadata(ORM_MODEL_METADATA, ORMMetaObj) || [];
		const newMetadata = [{ key, target, entity, options }, ...preMetadata];
		Reflect.defineMetadata(ORM_MODEL_METADATA, newMetadata, ORMMetaObj);
	};
}

export function RedisModel(options?: RedisOptions): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
      Reflect.getMetadata(CACHE_MODEL_METADATA, CacheMetaObj) || [];
		const newMetadata = [{ key, target, options }, ...preMetadata];
		Reflect.defineMetadata(CACHE_MODEL_METADATA, newMetadata, CacheMetaObj);
	};
}

export function WebSocketServer(): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
      Reflect.getMetadata(WSS_METADATA, WebsocketMetaObj) || [];
		const newMetadata = [{ key, target }, ...preMetadata];
		Reflect.defineMetadata(WSS_METADATA, newMetadata, WebsocketMetaObj);
	};
}

export type MgModelType<T> = ReturnModelType<Constructor<T>>;
export type OrmModelType<T extends ObjectLiteral> = Repository<T>;
