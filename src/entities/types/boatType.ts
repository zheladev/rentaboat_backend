import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Boat from "../boat";

@Entity({
    name: "boat_type"
})
@Unique(["name"])
class BoatType {
    @PrimaryGeneratedColumn("uuid", { name: "boat_type_id" })
    public id: string;

    @Column({ name: "int_value", nullable: false })
    public intValue: number;

    @Column({ nullable: false })
    public name: string;

    @OneToMany(() => Boat, boat => boat.boatType)
    public boats: Boat[];
}

export default BoatType;