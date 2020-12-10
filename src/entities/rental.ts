import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Boat from "./boat";
import SupportTicket from "./supportTicket";
import User from "./user";

export type PostgresTimeInterval = {
    days: number
}

@Entity()
@Unique(["boat", "startDate"])
class Rental {

    @PrimaryGeneratedColumn("uuid", { name: "rental_id" })
    public id: string;

    @ManyToOne(() => Boat, boat => boat.rentals)
    @JoinColumn({name: "boat_id"})
    public boat: Boat;

    @ManyToOne(() => User, user => user.rentals)
    @JoinColumn({name: "renter_id"})
    public renter: User;

    @Column({name: "start_date", type: "timestamp"})
    public startDate: Date;

    @Column({name: "duration_in_days", type: "interval"})
    public durationInDays: string | PostgresTimeInterval;

    @Column()
    public comment: string;

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.rental)
    public supportTickets: SupportTicket[];
}

export default Rental;