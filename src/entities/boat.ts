import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import BoatType from "./boatType";
import Shipyard from "./shipyard";
import User from "./user";

@Entity()
class Boat {
    @PrimaryGeneratedColumn("uuid", {name: "boat_id"})
    public id: string;

    @ManyToOne(() => User, user => user.boats)
    public user: User;

    @ManyToOne(() => Shipyard, shipyard => shipyard.boats)
    public shipyard: Shipyard;

    @ManyToOne(() => BoatType, boatType => boatType.boats)
    public boatType: BoatType;

    //TODO: add port

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

    //TODO: add one to many of other entities once they're implemented
}

export default Boat;