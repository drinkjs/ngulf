import { prop } from "@typegoose/typegoose";

export default class Project {
  @prop({ required: true })
  name!: string;

  @prop()
  createTime?: Date;

  @prop()
  updateTime?: Date;

  @prop()
  createUser?: string;

  @prop({ default: 0, select: false })
  status?: number; // 0:删除1正常;
}
