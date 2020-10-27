import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "./user";

@Entity({
    name: "user_type"
})
class UserType {
    @PrimaryGeneratedColumn("uuid")
    public userTypeId : string;

    @Column({name: "int_value", nullable: false})
    public intValue : number;

    @Column({nullable: false})
    public name : string;

    @OneToMany(() => User, user => user.userType)
    public users : User; 
}

export default UserType;