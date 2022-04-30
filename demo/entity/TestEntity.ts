import { Entity, Column } from "../../dist/typeorm";
import BaseORMEntity from "./BaseORMEntity";

@Entity()
export default class Test extends BaseORMEntity {
  @Column()
    name!: string;
}
