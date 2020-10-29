import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";
import Rental from "./rental";
import SupportTicket from "./supportTicket";
import UserType from "./userType";

@Entity({
    name: "user"
})
class User {
    @PrimaryGeneratedColumn("uuid", {name: "user_id"})
    public id?: string;

    @ManyToOne(() => UserType, userType => userType.users)
    @JoinColumn({ name: "user_type_id"})
    userType: UserType;

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

    @OneToMany(() => Boat, boat => boat.user)
    public boats: Boat[];

    @OneToMany(() => Rental, rental => rental.tenant)
    public rentals: Rental[];

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.issuer)
    public supportTickets: SupportTicket[];

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.assignedTo)
    public assignedSupportTickets: SupportTicket[];
}

export default User;