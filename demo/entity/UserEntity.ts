import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
} from "../../src/typeorm";

@Entity({ name: "user" })
export default class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  age?: number;
}
