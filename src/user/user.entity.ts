import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRepository } from "./user.repository";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Task } from "task/task.entity";

@Entity({ repository: () => UserRepository })
export class User {
    @PrimaryKey()
    id!: string;
    
    @Property()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @OneToMany(()=>Task, task => task.owner)
    tasks= new Collection<Task>(this);
}
