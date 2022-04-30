import { BaseController, Controller, Get } from "../../dist";
import AdminService from "../service/AdminService";
import HomeService from "../service/HomeService";

@Controller("/home")
export default class HomeController extends BaseController {
  constructor(
    private readonly service: HomeService,
    private readonly service2: AdminService
  ) {
    super();
  }

  @Get("/hello")
  async hello() {
    return this.success("hello ngulf");
  }
}
