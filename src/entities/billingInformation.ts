import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import User from "./user";

@Entity()
class BillingInformation {
    @PrimaryGeneratedColumn("uuid", {name: "billing_information_id"})
    public id: string;

    @ManyToOne(() => User, user => user.billingInformations)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @Column()
    public address: string;

    @Column({ name: "zip_code" })
    public zipCode: number;

    @Column()
    public city: string;

    @Column()
    public country: string;

}

export default BillingInformation;