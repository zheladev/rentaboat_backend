import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";
import SupportTicket from "./supportTicket";
import User from "./user";

@Entity()
class Rental {

    @PrimaryGeneratedColumn("uuid", { name: "rental_id" })
    public id: string;

    @ManyToOne(() => Boat, boat => boat.rentals)
    @JoinColumn({name: "boat_id"})
    public boat: Boat;

    @ManyToOne(() => User, user => user.rentals)
    @JoinColumn({name: "tenant_id"})
    public tenant: User;

    @Column({name: "start_date", type: "timestamp", unique: true})
    public startDate: Date;

    @Column({name: "duration_in_days", type: "interval"})
    public durationInDays: string;

    @Column()
    public comment: string;

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.rental)
    public supportTickets: SupportTicket[];
}

export default Rental;