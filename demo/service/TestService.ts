import { Injectable, RedisModel } from "../../dist";
import IORedis from "../../dist/ioredis";

@Injectable()
export default class TestService {
  @RedisModel()
  private redis!: IORedis.Redis;
}
