import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BoatType from "./types/boatType";
import Comment from "./comment";
import Port from "./port";
import Rating from "./rating";
import Rental from "./rental";
import Shipyard from "./shipyard";
import User from "./user";

@Entity()
class Boat {
    @PrimaryGeneratedColumn("uuid", {name: "boat_id"})
    public id: string;

    @ManyToOne(() => User, user => user.boats)
    @JoinColumn({ name: "user_id"})
    public user: User;

    @ManyToOne(() => Shipyard, shipyard => shipyard.boats)
    @JoinColumn({ name: "shipyard_id"})
    public shipyard: Shipyard;

    @ManyToOne(() => BoatType, boatType => boatType.boats)
    @JoinColumn({ name: "boat_type_id"})
    public boatType: BoatType;

    @ManyToOne(() => Port, port => port.boats)
    public port: Port;

    @Column()
    public description: string;

    @Column({name: "price_per_day", type: "decimal", scale: 2, precision: 20 })
    public pricePerDay: number;

    @Column({type: "decimal", scale: 2, precision: 10})
    public length: number;

    @Column()
    public model: string;

    @Column({default: false, name: "is_deleted", select: false})
    public isDeleted: boolean;

    @Column({name: "passenger_capacity"})
    public passengerCapacity: number;

    @Column({name: "number_of_cabins"})
    public numberOfCabins: number;

    @Column({name: "number_of_bathrooms"})
    public numberOfBathrooms: number;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "NOW()"
    })
    public createdAt: Date;

    @OneToMany(() => Rental, rental => rental.boat)
    public rentals: Rental[];

    @OneToMany(() => Rating, rating => rating.boat)
    public ratings: Rating[];

    @OneToMany(() => Comment, comment => comment.boat)
    public comments: Comment[];
    //TODO: add one to many of other entities once they're implemented
}

export default Boat;