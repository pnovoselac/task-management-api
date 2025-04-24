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

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

@Entity({ repository: () => ProjectRepository })
export class Project {
  [OptionalProps]?: "createdAt" | "updatedAt" | "deletedAt";
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => Task, (task) => task.project)
  tasks = new Collection<Task>(this);

  @ManyToOne(() => User)
  owner!: User;

  @ManyToMany(() => User, (user) => user.memberProjects, { owner: true })
  members = new Collection<User>(this);

  @Enum(() => Visibility)
  visibility: Visibility = Visibility.PRIVATE;
}
