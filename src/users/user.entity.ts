import { Report } from "../reports/report.entity";
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({default: true})
    admin: boolean;

    @OneToMany(() => Report, (report: Report) =>report.user)
    reports: Report[];

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id);
    }
    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id', this.id);
    }
    @AfterRemove()
    logRemove() {
        console.log('Removed User with id', this.id);
    }
}