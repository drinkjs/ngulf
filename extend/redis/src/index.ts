import "reflect-metadata";
import IORedis, {
	Cluster,
	ClusterNode,
	ClusterOptions,
	RedisOptions,
} from "ioredis";

const REDIS_MODEL_METADATA = Symbol.for("redis_metadata");
const RedisMetaObj = {};
const connects: Map<string, IORedis | Cluster> = new Map();

export * from "ioredis";
export default IORedis;

type RedisClusterOptions = ClusterOptions & { connectionName?: string };

export function Redis(
	options?: RedisOptions | RedisClusterOptions
): PropertyDecorator {
	return (target: any, key: any) => {
		const preMetadata =
			Reflect.getMetadata(REDIS_MODEL_METADATA, RedisMetaObj) || [];
		const newMetadata = [{ key, target, options }, ...preMetadata];
		Reflect.defineMetadata(REDIS_MODEL_METADATA, newMetadata, RedisMetaObj);
	};
}

export async function connect(opts: RedisOptions) {
	if (!opts.connectionName) opts.connectionName = "default";
	const redis = new IORedis(opts);

	redis.once("error", (err) => {
		throw err;
	});
	redis.once("close", () => {
		connects.delete(opts.connectionName!);
	});
	return new Promise((resolve) => {
		redis.once("connect", () => {
			connects.set(opts.connectionName!, redis);
			console.log(`redis@${opts?.host}:${opts?.port} connected`);
			resolve(redis);
		});
	});
}

export async function connectCluster(
	startupNodes: ClusterNode[],
	opts?: RedisClusterOptions
) {
	const connectionName =
		opts && opts.connectionName ? opts.connectionName : "default-cluster";
	const redis = new IORedis.Cluster(startupNodes, opts);

	redis.once("error", (err) => {
		throw err;
	});
	redis.once("close", () => {
		connects.delete(connectionName);
	});
	return new Promise((resolve) => {
		redis.once("connect", () => {
			startupNodes.forEach((node) => {
				console.log(
					`Redis cluster@${
						typeof node === "object" ? node.host : node
					} connected`
				);
			});
			resolve(redis);
		});
	});
}

export function inject(redisOpts: RedisOptions): Promise<void>;
export function inject(
	startupNodes: ClusterNode[],
	options?: RedisClusterOptions
): Promise<void>;
export function inject(redis: IORedis | Cluster): Promise<void>;

export async function inject(
	redisOpts: RedisOptions | ClusterNode[] | IORedis | Cluster,
	clusterOptions?: RedisClusterOptions
) {
	const services: any[] = Reflect.getMetadata(
		REDIS_MODEL_METADATA,
		RedisMetaObj
	);
	if (services) {
		for (const service of services) {
			const { key, target, options } = service;

			if(target[key]) return;

			if(redisOpts instanceof IORedis || (redisOpts instanceof Cluster)){
				target[key] = redisOpts;
			}else if (Array.isArray(redisOpts)) {
				const opts: RedisClusterOptions | undefined = options ?? clusterOptions;
				const connectionName =
					opts && opts.connectionName ? opts.connectionName : "default-cluster";
				target[key] =
					connects.get(connectionName) ??
					(await connectCluster(redisOpts, opts));
			} else {
				const opts: RedisOptions = options ?? redisOpts;
				if (!opts.connectionName) opts.connectionName = "default";
				target[key] =
					connects.get(opts.connectionName) ?? (await connect(opts));
			}
		}
	}
}