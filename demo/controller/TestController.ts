import { BaseController, Controller, Get } from "../../dist";
@Controller("/test")
export default class TestController extends BaseController {
  @Get("/hello")
  async hello() {
    return this.success("hello ngulf");
  }
}
