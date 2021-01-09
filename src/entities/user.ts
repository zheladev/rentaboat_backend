import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";
import Chat from "./chat";
import Comment from "./comment";
import Message from "./message";
import Rating from "./rating";
import Rental from "./rental";
import SupportTicket from "./supportTicket";
import UserType from "./types/userType";
import * as bcrypt from 'bcrypt';
import BillingInformation from "./billingInformation";

const BCRYPT_SALT_ROUNDS = 10;

@Entity({
    name: "user"
})
class User {
    @PrimaryGeneratedColumn("uuid", {name: "user_id"})
    public id?: string;

    @ManyToOne(() => UserType, userType => userType.users)
    @JoinColumn({ name: "user_type_id"})
    userType: UserType;

    @Column({default: true, name: "is_active", select: false})
    public isActive: boolean;

    @Column({default: false, name: "is_deleted", select: false})
    public isDeleted: boolean;

    @Column({unique: true, nullable: false})
    public email: string;

    @Column({unique: true, nullable: false})
    public username: string;

    @Column({name: "first_name", nullable: false})
    public firstName: string;

    @Column({name: "last_name", nullable: false})
    public lastName: string;

    @Column({nullable: false, select: false})
    public address: string;

    @Column({nullable: false, select: false})
    public password: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "NOW()"
    })
    public createdAt: Date;

    @OneToMany(() => Boat, boat => boat.user)
    public boats: Boat[];

    @OneToMany(() => Rental, rental => rental.renter)
    public rentals: Rental[];

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.issuer)
    public supportTickets: SupportTicket[];

    @OneToMany(() => SupportTicket, supportTicket => supportTicket.assignedTo)
    public assignedSupportTickets: SupportTicket[];

    @OneToMany(() => Rating, comment => comment.user)
    public ratings: Rating[];

    @OneToMany(() => Comment, comment => comment.user)
    public comments: Comment[];

    @OneToMany(() => Chat, chat => chat.receiver)
    public chats: Chat[];

    @OneToMany(() => Chat, chat => chat.creator)
    public createdChats: Chat[];

    @OneToMany(() => Message, message => message.user)
    public messages: Message[];

    @OneToMany(() => BillingInformation, BillingInformation => BillingInformation.user)
    public billingInformations: BillingInformation[];

    @BeforeInsert()
    async beforeInsert() {
        this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    }

    async isValidPassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }
}

export default User;