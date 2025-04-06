import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Task } from "../task/task.entity";
import { ProjectRepository } from "./project.repository";
import { User } from "../user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

@Entity({ repository: () => ProjectRepository })
export class Project {
  [OptionalProps]?: "createdAt" | "updatedAt" | "deletedAt";
  @ApiProperty({
    description: "Project identificator",
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({ description: "Project name", example: "Task Management API" })
  @Property()
  title!: string;

  @ApiProperty({
    description: "Project description",
    example: "REST API for a task management application",
  })
  @Property()
  description!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({
    description: "Tasks assigned for project",
    type: [Task],
  })
  @OneToMany(() => Task, (task) => task.project)
  tasks = new Collection<Task>(this);

  @ApiProperty({ description: "Project owner", type: () => User })
  @ManyToOne(() => User)
  owner!: User;

  @ApiProperty({ description: "Project members", type: [User] })
  @ManyToMany(() => User, (user) => user.memberProjects, { owner: true })
  members = new Collection<User>(this);

  @ApiProperty({
    description: "Project visibility",
    enum: Visibility,
    example: Visibility.PRIVATE,
    default: Visibility.PRIVATE,
  })
  @Enum(() => Visibility)
  visibility: Visibility = Visibility.PRIVATE;
}
