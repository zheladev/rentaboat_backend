import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn("uuid")
    public id?: string;

    @Column({unique: true})
    public email: string;

    @Column({unique: true})
    public name: string;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column()
    public address: string;

    @Column()
    public password: string;
}

export default User;