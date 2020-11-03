import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "../user";

@Entity({
    name: "user_type"
})
class UserType {
    @PrimaryGeneratedColumn("uuid", { name: "user_type_id" })
    public id: string;

    @Column({ name: "int_value", nullable: false })
    public intValue: number;

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: false, name: "is_registrable" })
    public isRegistrable: boolean;

    @Column({ nullable: false, name: "is_admin" })
    public isAdmin: boolean;

    @OneToMany(() => User, user => user.userType)
    public users: User[];
}

export default UserType;