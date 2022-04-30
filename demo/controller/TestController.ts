import { BaseController, Controller, Get } from "../../dist";
import TestService from "../service/TestService";
@Controller("/test")
export default class TestController extends BaseController {
  constructor(private readonly service: TestService) {
    super();
  }

  @Get("/hello")
  async hello() {
    return this.success("hello ngulf");
  }
}
