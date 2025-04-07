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

  @ApiProperty({
    description: "Unique identifier for the file",
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: "URL of the file",
    example: "https://storage.googleapis.com/task-files/example.pdf",
  })
  @Property()
  url!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @ApiProperty({
    description: "Task to which the file belongs",
    type: () => Task,
  })
  @ManyToOne(() => Task)
  task!: Task;
}
