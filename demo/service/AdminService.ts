// import IORedis from "ioredis";
// import AppError from "../common/AppError";
import { OrmModelType, OrmModel, Injectable } from "../../dist";
import AdminEntity from "../entity/AdminEntity";

@Injectable()
export default class AdminService {
  @OrmModel(AdminEntity)
  private model!: OrmModelType<AdminEntity>;

  async findAll() {
    return await this.model.findBy({ status: 1 });
  }

  async findByName(name: string) {
    return await this.model.findOneBy({ name });
  }
}
