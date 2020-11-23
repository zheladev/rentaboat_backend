import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";
import User from "./user";


@Entity()
class Comment {

    @PrimaryGeneratedColumn("uuid", { name: "comment_id" })
    public id: string;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @ManyToOne(() => Boat, boat => boat.comments)
    @JoinColumn({ name: "boat_id" })
    public boat: Boat;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "NOW()"
    })
    public createdAt: Date;

    @Column()
    public comment: string;
}

export default Comment;