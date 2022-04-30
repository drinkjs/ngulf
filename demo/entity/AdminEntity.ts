import { Entity, Column } from "../../dist/typeorm";
import BaseORMEntity from "./BaseORMEntity";

@Entity()
export default class Admin extends BaseORMEntity {
  @Column()
    name!: string;

  @Column()
    pwd!: string;

  @Column({ name: "last_login_time", nullable: true })
    lastLoginTime?: string;

  @Column({ nullable: true })
    role?: string;

  @Column({ name: "login_fail", nullable: true })
    loginFail!: number;
}
