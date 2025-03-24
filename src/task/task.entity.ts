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
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => Status)
  status: Status = Status.TO_DO;

  @Enum(() => Priority)
  priority: Priority = Priority.LOW;

  @Property({ nullable: true })
  dueDate?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => Project)
  project!: Project;

  @ManyToOne(() => User)
  owner!: User;

  @OneToMany(() => File, (file) => file.task)
  files = new Collection<File>(this);
}
