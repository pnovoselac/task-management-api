import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { TaskRepository } from "./task.repository";
import { Project } from "../project/project.entity";
import { User } from "../user/user.entity";
import { File } from "../file/file.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum Status {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

@Entity({ repository: () => TaskRepository })
export class Task {
  [OptionalProps]?: "createdAt" | "updatedAt" | "deletedAt";

  @ApiProperty({ description: "Task identifier", example: 1 })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: "Title of the task",
    example: "Complete Swagger documentation",
  })
  @Property()
  title!: string;

  @ApiProperty({
    description: "Description of the task",
    example: "Write detailed Swagger documentation for Task entity",
    nullable: true,
  })
  @Property({ nullable: true })
  description?: string;

  @ApiProperty({
    description: "Status of the task",
    enum: Status,
    example: Status.TO_DO,
  })
  @Enum(() => Status)
  status: Status = Status.TO_DO;

  @ApiProperty({
    description: "Priority of the task",
    enum: Priority,
    example: Priority.HIGH,
  })
  @Enum(() => Priority)
  priority: Priority = Priority.LOW;

  @ApiProperty({
    description: "Due date for the task",
    example: "2025-04-15T00:00:00.000Z",
    nullable: true,
  })
  @Property({ nullable: true })
  dueDate?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date | null;

  @ApiProperty({
    description: "Project which contains task",
    type: () => Project,
  })
  @ManyToOne(() => Project)
  project!: Project;

  @ApiProperty({ description: "Owner of the task", type: () => User })
  @ManyToOne(() => User)
  owner!: User;

  @ApiProperty({ description: "Files associated with the task", type: [File] })
  @OneToMany(() => File, (file) => file.task)
  files = new Collection<File>(this);
}
