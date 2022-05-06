import { Inject, Injectable, RedisModel } from "../../dist";
import IORedis from "../../dist/ioredis";
import AdminService from "./AdminService";
import TestService from "./TestService";

@Injectable()
export default class HomeService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly testServer: TestService) {}

  @Inject(() => AdminService)
  private server!: AdminService;

  // @Inject(TestService)
  // private testServer!:TestService

  @RedisModel()
  private redis!: IORedis.Redis;

  test() {
    return this.server.findByName("ffffffffff");
  }

  name() {
    this.testServer.hello();
    return "timou";
  }
}
