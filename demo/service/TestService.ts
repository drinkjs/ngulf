import { Injectable, RedisModel, OrmModelType, OrmModel } from "../../dist";
import IORedis from "../../dist/ioredis";
import TestEntity from "../entity/TestEntity";

@Injectable()
export default class TestService {
  @RedisModel()
  private redis!: IORedis.Redis;

  @OrmModel(TestEntity)
  private model!: OrmModelType<TestEntity>;

  hello() {
    console.log("---------hello test------------");
  }
}
