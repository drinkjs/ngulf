import { AppError, Injectable, MgModel, MgModelType } from "../../src";
import ProjectEntity from "../entity/ProjectTntity";

@Injectable()
export default class ProjectService {
  @MgModel(ProjectEntity)
  model!: MgModelType<ProjectEntity>;

  async find(name: string) {
    const rel = await this.model.findOne({ name }).exec();

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
}
