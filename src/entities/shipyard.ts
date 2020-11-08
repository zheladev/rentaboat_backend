import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";


@Entity()
class Shipyard {
    @PrimaryGeneratedColumn("uuid", { name: "shipyard_id" })
    public id: string;

    @Column({nullable: false, unique: true})
    public name: string;

    @OneToMany(() => Boat, boat => boat.shipyard)
    public boats: Boat[];
}

export default Shipyard;