import { BaseController, Controller, Get } from "../../src";
@Controller("/test")
export default class TestController extends BaseController {
  @Get("/hello")
  async hello() {
    return this.success("hello ngulf");
  }
}
