import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Task } from "../task/task.entity";
import { ProjectRepository } from "./project.repository";
import { User } from "../user/user.entity";

@Entity({ repository: () => ProjectRepository })
export class Project {
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

  @OneToMany(() => Task, (task) => task.project)
  tasks = new Collection<Task>(this);

  @ManyToOne(() => User)
  owner!: User;

  @OneToMany(() => User, (user) => user.memberProjects)
  members = new Collection<User>(this);
}
