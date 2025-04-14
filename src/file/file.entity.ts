import {
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { FileRepository } from "./file.repository";
import { Task } from "../task/task.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ repository: () => FileRepository })
export class File {
  [OptionalProps]?: "createdAt";

  @PrimaryKey()
  id!: number;

  @Property()
  url!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ManyToOne(() => Task)
  task!: Task;
}
