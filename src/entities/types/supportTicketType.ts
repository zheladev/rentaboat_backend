import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import SupportTicket from "../supportTicket";


@Entity({
    name: "support_ticket_type"
})
@Unique(["name"])
class SupportTicketType {

    @PrimaryGeneratedColumn("uuid", {name: "id"})
    public id: string;

    @Column({name: "int_value"})
    public intValue: number;

    @Column()
    public name: string;

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.supportTicketType)
    public supportTickets: SupportTicket[];
}

export default SupportTicketType;