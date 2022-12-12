import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
} from "../../src/typeorm";

@Entity({ name: "test" })
export default class TestEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;
}
