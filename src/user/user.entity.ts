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
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Task } from "../task/task.entity";
import { Project } from "../project/project.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ repository: () => UserRepository })
export class User {
  [OptionalProps]?: "createdAt" | "updatedAt" | "deletedAt";

  @ApiProperty({
    description: "Unique identifier for the user (Firebase UID)",
    example: "P0ig64TxsnbeOC5UB8L7Yx6Duw1",
  })
  @PrimaryKey()
  id!: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "user@example.com",
  })
  @Property()
  email!: string;

  @ApiProperty({
    description: "Tasks assigned to the user",
    type: () => [Task],
  })
  @OneToMany(() => Task, (task) => task.owner)
  tasks = new Collection<Task>(this);

  @ApiProperty({
    description: "Projects owned by the user",
    type: () => [Project],
  })
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects = new Collection<Project>(this);

  @ApiProperty({
    description: "Projects where the user is a member",
    type: () => [Project],
  })
  @ManyToMany(() => Project, (project) => project.members)
  memberProjects = new Collection<Project>(this);

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date = new Date();
}
