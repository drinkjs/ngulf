import { CACHE_MODEL_METADATA } from "../core/decorator/metaKeys";
import IORedis, { RedisOptions } from "ioredis";

// sudo service redis-server restart

export default class Rediser {
	// eslint-disable-next-line no-use-before-define
	static instance: Rediser;

	static create() {
		if (!Rediser.instance) {
			Rediser.instance = new Rediser();
		}
		return Rediser.instance;
	}

	private redisConnects: IORedis[] = [];

	async addConnect(opts: RedisOptions) {
		if (!opts.name) opts.name = "default";
		const redis = new IORedis(opts);
		return new Promise((resolve) => {
			redis.once("connect", () => {
				this.redisConnects.push(redis);
				console.log(`redis@${opts?.host}:${opts?.port} connected`.green);
				resolve(redis);
			});
			redis.once("error", (err) => {
				throw err;
			});
		});
	}

	async inject(redisOpts: RedisOptions) {
		const services: any[] = Reflect.getMetadata(CACHE_MODEL_METADATA, Rediser);
		if (services) {
			for (const service of services) {
				const { key, target, options } = service;
				const opts: RedisOptions = options || redisOpts;
				if (!opts.name) opts.name = "default";
				target[key] =
          this.redisConnects.find((v) => v.options.name === opts.name) ||
          (await this.addConnect(opts));
			}
		}
	}

	// getRedis () {
	//   return this.redis;
	// }

	// async get<T> (key: string): Promise<T | null> {
	//   const rel = await this.redis.get(key);
	//   if (rel) {
	//     const obj: T = JSON.parse(rel);
	//     return obj;
	//   }
	//   return null;
	// }

	// async getString (key: string): Promise<string | null> {
	//   return await this.redis.get(key);
	// }

	// async set (key: string, value: any, time?: number) {
	//   const val = typeof value === "object" ? JSON.stringify(value) : value;
	//   const rel = time
	//     ? await this.redis.set(key, val, "EX", time)
	//     : await this.redis.set(key, val);
	//   return rel === "OK";
	// }

	// async del (key: string) {
	//   return await this.redis.del(key);
	// }
}
