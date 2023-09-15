import { Injectable } from "../../src";
import ProjectEntity from "../entity/ProjectTntity";
import { Mongo, MongoModel } from "../../extend/mongo/src";
import IORedis, { Redis } from "../../extend/redis/src";

@Injectable()
export default class ProjectService {
	@Mongo(ProjectEntity)
	model!: MongoModel<ProjectEntity>;

	@Redis()
	private redis!: IORedis;

	async find(name: string) {
		const rel = await this.model.findOne({ name }).exec();
    if(rel)
      await this.redis.set(name, JSON.stringify(rel.toJSON()));
		return rel;
	}

	async add(name: string, type?: string) {
		const project: ProjectEntity = {
			name,
			type,
		};
		const { _id: id } = await this.model.create(project);
		return id;
	}

	async findCache(name: string) {
    const rel = await this.redis.get(name);
    if(rel){
      return JSON.parse(rel);
    }
  }
}
