import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "NOW()"
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: "last_updated",
        type: "timestamp",
    })
    public lastUpdated: Date;

    @OneToMany(() => Message, message => message.chat)
    public messages: Message[];
}

export default Chat;