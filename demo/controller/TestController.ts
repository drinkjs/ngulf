import { BaseController, Controller, Get  } from "ngulf";
@Controller("/test")
export default class TestController extends BaseController {
  @Get("/hello")
  async hello() {
    return this.success("hello world");
  }
}
