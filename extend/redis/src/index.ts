import "reflect-metadata";
import IORedis, { RedisOptions } from "ioredis";

const REDIS_MODEL_METADATA = Symbol.for("redis_metadata");
const RedisMetaObj = {};
const connects: Map<string, IORedis> = new Map();

export * from "ioredis";
export default IORedis;

export function Redis(options?: RedisOptions): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
			Reflect.getMetadata(REDIS_MODEL_METADATA, RedisMetaObj) || [];
		const newMetadata = [{ key, target, options }, ...preMetadata];
		Reflect.defineMetadata(REDIS_MODEL_METADATA, newMetadata, RedisMetaObj);
	};
}

export async function connect(opts: RedisOptions) {
	if (!opts.name) opts.name = "default";
	const redis = new IORedis(opts);
	return new Promise((resolve) => {
		redis.once("connect", () => {
			connects.set(opts.name!, redis);
			console.log(`redis@${opts?.host}:${opts?.port} connected`);
			resolve(redis);
		});
		redis.once("error", (err) => {
			throw err;
		});
	});
}

export async function inject(redisOpts: RedisOptions) {
	const services: any[] = Reflect.getMetadata(
		REDIS_MODEL_METADATA,
		RedisMetaObj
	);
	if (services) {
		for (const service of services) {
			const { key, target, options } = service;
			const opts: RedisOptions = options || redisOpts;
			if (!opts.name) opts.name = "default";
			target[key] = connects.get(opts.name) ?? (await connect(opts));
		}
	}
}
