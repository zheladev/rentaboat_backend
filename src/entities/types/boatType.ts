import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "../boat";

@Entity({
    name: "boat_type"
})
class BoatType {
    @PrimaryGeneratedColumn("uuid", { name: "boat_type_id" })
    public id: string;

    @Column({ nullable: false })
    public name: string;

    @OneToMany(() => Boat, boat => boat.boatType)
    public boats: Boat[];
}

export default BoatType;