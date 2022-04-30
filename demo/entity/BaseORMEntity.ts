import {
  BeforeInsert,
  Column,
  PrimaryGeneratedColumn,
} from "../../dist/typeorm";

export default abstract class BaseORMEntity {
  @PrimaryGeneratedColumn("uuid")
    id!: string;

  @Column({ name: "create_time" })
    createTime!: number;

  @Column({ default: 0, select: false })
    status!: 0 | 1;

  @BeforeInsert()
  generateUuid() {
    this.createTime = Date.now();
  }
}
