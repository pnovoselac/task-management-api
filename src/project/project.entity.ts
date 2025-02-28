import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Task } from "src/task/task.entity";

@Entity()
export class Project{
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    @Property()
    description: string;

    @Property({onCreate: () => new Date()})
    createdAt: Date = new Date();

    @Property({onCreate: () => new Date(), onUpdate: () => new Date()})
    updatedAt: Date = new Date();

    @OneToMany(()=>Task, task => task.project)
    tasks= new Collection<Task>(this);
}
