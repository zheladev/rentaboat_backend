import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";
import User from "./user";

@Entity()
class Rating {
    
    @PrimaryGeneratedColumn("uuid", {name: "rating_id"})
    public id: string;

    @ManyToOne(() => User, user => user.ratings)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @ManyToOne(() => Boat, boat => boat.ratings)
    @JoinColumn({ name: "boat_id" })
    public boat: Boat;

    @Column({
        name: "created_at",
        type: "timestamp",
    })
    public createdAt: Date;

    @Column() //TODO: add 0 to 10 restraint
    public rating: number;

    @Column()
    public comment: string;
}

export default Rating;