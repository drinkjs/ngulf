// import IORedis from "ioredis";
// import AppError from "../common/AppError";
import { OrmModelType, OrmModel, Injectable, Inject } from "../../dist";
import AdminEntity from "../entity/AdminEntity";
import HomeService from "./HomeService";

@Injectable()
export default class AdminService {
  @OrmModel(AdminEntity)
  private model!: OrmModelType<AdminEntity>;

  @Inject(() => HomeService)
  private server!: HomeService;

  async findAll() {
    return await this.model.findBy({ status: 1 });
  }

  async findByName(name: string) {
    console.log(this.server.name());
    return await this.model.findOneBy({ name });
  }
}
