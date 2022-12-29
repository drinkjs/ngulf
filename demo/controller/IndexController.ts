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
import TestService from "../service/TestService";

@Controller("/index")
export default class IndexController {
  constructor(private readonly service: TestService) {}

  @Get("/get")
  async getName(@Query("name") name: string, ctx: RouterContext) {
    console.log(ctx.req.session);
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
