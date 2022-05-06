import { BaseController, Controller, Get } from "../../dist";
import AdminService from "../service/AdminService";

@Controller("/home")
export default class HomeController extends BaseController {
  constructor(private readonly service2: AdminService) {
    super();
  }

  @Get("/hello")
  async hello() {
    this.service2.findByName("fdfd");
    return this.success("hello ngulf");
  }
}
