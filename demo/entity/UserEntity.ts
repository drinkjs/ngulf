import {
	Entity,
	Column,
	Index,
	PrimaryGeneratedColumn,
} from "../../extend/typeorm/src";;

@Entity({ name: "user" })
export default class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "int" })
	age?: number;
}
