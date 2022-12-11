import { IsNotEmpty } from "../../src/class-validator";

export default class TestDto {
  @IsNotEmpty({ groups: ["add"] })
  name!: string;
}
