import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { UserRepository } from "./user.repository";
import { v4 } from "uuid";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Task } from "../task/task.entity";
import { Project } from "../project/project.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ repository: () => UserRepository })
export class User {
  [OptionalProps]?: "createdAt" | "updatedAt" | "deletedAt";

  @PrimaryKey({ type: "uuid" })
  id: string = v4();

  @Property()
  firebaseId?: string;

  @Property()
  email!: string;

  @OneToMany(() => Task, (task) => task.owner)
  tasks = new Collection<Task>(this);

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects = new Collection<Project>(this);

  @ManyToMany(() => Project, (project) => project.members)
  memberProjects = new Collection<Project>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date = new Date();
}
