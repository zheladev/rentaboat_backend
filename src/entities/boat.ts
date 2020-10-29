import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BoatType from "./boatType";
import Port from "./port";
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

    //add restraints
    @Column({name: "price_per_day"})
    public pricePerDay: number;

    @Column()
    public length: number;

    @Column()
    public model: string;

    @Column({name: "passenger_capacity"})
    public passengerCapacity: number;

    @Column({name: "number_of_cabins"})
    public numberOfCabins: number;

    @Column({name: "number_of_bathrooms"})
    public numberOfBathrooms: number;

    @OneToMany(() => Rental, rental => rental.boat)
    public rentals: Rental[];
    //TODO: add one to many of other entities once they're implemented
}

export default Boat;