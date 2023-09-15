import { inject as typeORMInject } from "../../extend/typeorm/src";
import { inject as mongoInject } from "../../extend/mongo/src";
import { inject as redisInject } from "../../extend/redis/src";
import UserEntity from "../entity/UserEntity";

export default async function inject() {
	await typeORMInject({
		type: "mysql",
		port: 3306,
		host: "localhost",
		username: "root",
		password: "2012131417",
		database: "test",
		entityPrefix: "ngulf_",
		entities: [UserEntity],
		bigNumberStrings: false,
		synchronize: true, // 生产环境必需为false，否则会丢失数据
	});

	await mongoInject({
		// see https://mongoosejs.com/
		uris: "mongodb://127.0.0.1:27017",
		options: {
			dbName: "ngulf_test",
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			autoIndex: false,
			serverSelectionTimeoutMS: 5000,
			bufferCommands: false,
			// useFindAndModify: false,
		},
	});

	await redisInject({
		host: "127.0.0.1",
		port: 6379,
		keyPrefix: "ngulf:",
	})
}
