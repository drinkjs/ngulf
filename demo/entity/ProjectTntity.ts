import { prop } from "../../extend/mongo/src";

export default class Project {
  @prop({ required: true })
  name!: string;

  @prop()
  type?: string;
}
