import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Rental from "./rental";
import SupportTicketType from "./types/supportTicketType";
import User from "./user";

@Entity({
    name: "support_ticket"
})
class SupportTicket {

    @PrimaryGeneratedColumn("uuid", { name: "support_ticket_id" })
    public id: string;

    @ManyToOne(() => User, user => user)
    @JoinColumn({ name: "issuer_id"})
    public issuer: User;

    @ManyToOne(() => SupportTicketType, supportTicketType => supportTicketType.supportTickets)
    @JoinColumn({ name: "support_ticket_type_id"})
    public supportTicketType: SupportTicketType;

    @ManyToOne(() => Rental, rental => rental.supportTickets)
    @JoinColumn({ name: "rental_id"})
    public rental: Rental;

    //TODO: add assigned to relation 
    @ManyToOne(() => User, user => user.assignedSupportTickets, { nullable: true })
    @JoinColumn({name: "assinged_to"})
    public assignedTo: User;

    @Column()
    public isAssigned: boolean;

    @Column()
    public subject: string;

    @Column({name: "content_body"})
    public contentBody: string;

    @Column({name: "is_resolved"})
    public isResolved: boolean;
}

export default SupportTicket;