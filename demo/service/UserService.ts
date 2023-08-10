import { Injectable, OrmModel, OrmModelType } from "../../src";
import UserEntity from "../entity/UserEntity";

@Injectable()
export default class UserService {
  @OrmModel(UserEntity)
  private model!: OrmModelType<UserEntity>;

  async query(name: string) {
    return await this.model.findOneBy({ name });
  }

  async add(name: string, age?: number) {
    const data = this.model.create();
    data.name = name;
    data.age = age;
    return await this.model.save(data);
  }
}
