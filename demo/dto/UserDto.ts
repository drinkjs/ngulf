import { IsNotEmpty, IsNumber, IsOptional } from "../../src/class-validator";

export default class UserDto {
  @IsNotEmpty({ groups: ["add"], message: "name不能为空" })
  name!: string;

  @IsOptional({ groups: ["add", "update"] })
  @IsNumber(undefined, { groups: ["add", "update"] })
  age?: number;
}
