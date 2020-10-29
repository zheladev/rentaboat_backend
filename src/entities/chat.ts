import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Message from "./message";
import User from "./user";

@Entity()
class Chat {
    
    @PrimaryGeneratedColumn("uuid", { name: "chat_id" })
    public id: string;

    @ManyToOne(() => User, user => user.createdChats)
    @JoinColumn({ name: "creator_id" })
    public creator: User;

    @ManyToOne(() => User, user => user.chats)
    @JoinColumn({ name: "receiver_id" })
    public receiver: User;

    @Column({
        name: "created_at",
        type: "timestamp",
    })
    public createdAt: Date;

    @Column({
        name: "last_updated",
        type: "timestamp",
    })
    public lastUpdated: Date;

    @OneToMany(() => Message, message => message.chat)
    public messages: Message[];
}

export default Chat;