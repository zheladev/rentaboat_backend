import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import UserType from "./userType";

@Entity({
    name: "user"
})
class User {
    @PrimaryGeneratedColumn("uuid", {name: "user_id"})
    public userId?: string;

    //add user type relation
    @Column({unique: true, nullable: false})
    public email: string;

    @Column({unique: true, nullable: false})
    public username: string;

    @Column({name: "first_name", nullable: false})
    public firstName: string;

    @Column({name: "last_name", nullable: false})
    public lastName: string;

    @Column({nullable: false})
    public address: string;

    @Column({nullable: false})
    public password: string;

    @ManyToOne(() => UserType, userType => userType.users)
    userType: UserType;
}

export default User;