import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  RouterContext,
  Validation,
} from "../../src";
import UserDto from "../dto/UserDto";
import ProjectService from "../service/ProjectService";
import UserService from "../service/UserService";

@Controller("/test")
export default class TestController {
  constructor(
    private readonly service: UserService,
    private readonly projectService: ProjectService
  ) {}

  @Get("/get")
  async testGet(@Query("name") name: string) {
    return name;
  }

  @Post("/post")
  async testPost(@Body() data: { name: string }) {
    return data;
  }

  @Put("/put")
  async testPut(@Body() data: { name: string }) {
    return data;
  }

  @Delete("/delete")
  async testDelete(@Query() data: { name: string }) {
    return data;
  }

  @Get("/headers")
  async testHeaders(@Headers("x-name") name: string) {
    return name;
  }

  @Post("/post/headers")
  async testPostHeaders(
    @Body("name") firstName: string,
    @Headers("x-name") lastName: string
  ) {
    return { firstName, lastName };
  }

  @Post("/validator")
  async testValidator(@Body(new Validation({ groups: ["add"] })) dto: UserDto) {
    return dto;
  }

  @Post("/orm")
  async testORM(@Body(new Validation({ groups: ["add"] })) dto: UserDto) {
    await this.service.add(dto.name, dto.age);
    const user = await this.service.query(dto.name);
    return user;
  }

  @Post("/mongo")
  async testMongo(@Body() data: { name: string; type?: string }) {
    await this.projectService.add(data.name, data.type);
    const project = await this.projectService.find(data.name);
    return project;
  }
}
