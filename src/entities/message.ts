import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Chat from "./chat";
import User from "./user";

@Entity()
class Message {

    @PrimaryGeneratedColumn("uuid", { name: "message_id" })
    public id: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: "chat_id" })
    public chat: Chat;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @Column()
    public content: string;
}

export default Message;