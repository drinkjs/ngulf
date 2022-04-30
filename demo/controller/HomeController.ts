import { BaseController, Controller, Get } from "../../dist";
import HomeService from "../service/HomeService";

@Controller("/home")
export default class HomeController extends BaseController {
  constructor(private readonly service: HomeService) {
    super();
  }

  @Get("/hello")
  async hello() {
    return this.success("hello ngulf");
  }
}
