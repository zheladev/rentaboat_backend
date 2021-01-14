import { Point } from "geojson";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Boat from "./boat";

@Entity()
class Port {
    @PrimaryGeneratedColumn("uuid", {name: "port_id"})
    public id: string;

    @Column()
    public name: string;

    @Column({
        type: 'geometry',
        nullable: true,
        spatialFeatureType: 'Point'
    })
    public coordinates: Point;

    @OneToMany(() => Boat, boat => boat.port)
    public boats: Boat[];
}

export default Port;