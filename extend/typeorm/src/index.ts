import "reflect-metadata";
import {
	DataSource,
	DataSourceOptions,
	ObjectLiteral,
	Repository,
} from "typeorm";

const TYPE_ORM_METADATA_KEY = Symbol.for("TYPE_ORM_KEY");
const TypeORMMetaObject = {};
const DefaultName = "default";
const dataSources: Map<string, DataSource> = new Map();

export * from "typeorm";

export type Constructor<T = any> = new (...args: any[]) => T;
export type ConnectOptions = DataSourceOptions & { name?: string };

export function TypeORM(
	entity: Constructor,
	options?: ConnectOptions
): PropertyDecorator {
	return (target: any, key: any) => {
		const oldMetadata =
			Reflect.getMetadata(TYPE_ORM_METADATA_KEY, TypeORMMetaObject) || [];
		const newMetadata = [{ key, target, entity, options }, ...oldMetadata];
		Reflect.defineMetadata(
			TYPE_ORM_METADATA_KEY,
			newMetadata,
			TypeORMMetaObject
		);
	};
}

export type TypeORMModel<T extends ObjectLiteral> = Repository<T>;

export async function connect(opts: ConnectOptions) {
	const appDataSource = new DataSource(opts);
	const ds = await appDataSource.initialize().catch((err) => {
		throw err;
	});
	if (!ds) return;
	dataSources.set(opts.name || DefaultName, ds);
	// here you can start to work with your database
	const connectOptions: any = opts;
	console.log(
		`${connectOptions.type}@${connectOptions?.host || ""}:${
			connectOptions?.port || ""
		} connected`
	);
	return ds;
}

export async function inject(ormOpts:ConnectOptions ) :Promise<void>
export async function inject(ormOpts:DataSource ) :Promise<void>

export async function inject(ormOpts: ConnectOptions | DataSource) {
	// 注入orm repository
	const services: any[] = Reflect.getMetadata(
		TYPE_ORM_METADATA_KEY,
		TypeORMMetaObject
	);
	if (services) {
		for (const service of services) {
			const { key, target, entity, options } = service;
			if (target[key]) {
				return;
			}

			if(ormOpts instanceof DataSource){
				target[key] = ormOpts;
			}else{
				const opts = options || ormOpts;
				if (!opts.name) {
					opts.name = DefaultName;
				}
				const connection = dataSources.get(opts.name) ?? (await connect(opts));
				if (connection) {
					target[key] = connection.getRepository(entity);
				}
			}
		}
	}
}
