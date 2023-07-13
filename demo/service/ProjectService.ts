import { AppError, Injectable, MgModel, MgModelType } from "../../src";
import ProjectEntity from "../entity/ProjectTntity";

@Injectable()
export default class ProjectService {
  @MgModel(ProjectEntity)
  model!: MgModelType<ProjectEntity>;

  async findAll() {
    const rel = await this.model
      .find({ status: 1 })
      .sort({ createTime: -1 })
      .exec();

    return rel;
  }

  async add() {
    const project: ProjectEntity = {
      name: "dddfd",
      createTime: new Date(),
      updateTime: new Date(),
      status: 1,
    };
    const { _id: id } = await this.model.create(project);
    return id;
  }
}
