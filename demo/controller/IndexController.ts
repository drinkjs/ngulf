import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  RouterContext,
  Validation,
} from "../../src";
import TestDto from "../dto/TestDto";
import ProjectService from "../service/ProjectService";
import TestService from "../service/TestService";

@Controller("/index")
export default class IndexController {
  constructor(
    private readonly service: TestService,
    private readonly moService: ProjectService
  ) {
    setTimeout(() => {
      console.log(moService.model);
    }, 1000);
  }

  @Get("/get")
  async getName(@Query("name") name: string) {
    this.moService.add();
    return await this.service.query(name);
  }

  @Post("/add")
  async addName(@Body(new Validation({ groups: ["add"] })) dto: TestDto) {
    const rel = await this.service.add(dto.name);
    if (rel) {
      return true;
    }
  }
}
