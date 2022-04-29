import { BaseController } from "../../src";
import { Controller, Get } from "../../src/core";

@Controller("/test")
export default class TestController extends BaseController {
  @Get("/hello")
  async hello() {
    return this.success("hello world");
  }
}
