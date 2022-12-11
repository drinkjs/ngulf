import { Injectable, OrmModel, OrmModelType } from "../../src";
import TestEntity from "../entity/TestEntity";

@Injectable()
export default class EmailService {
  @OrmModel(TestEntity)
  private model!: OrmModelType<TestEntity>;

  async query(name: string) {
    return await this.model.findOneBy({ name });
  }

  async add(name: string) {
    const data = this.model.create();
    data.name = name;
    return await this.model.save(data);
  }
}
