import { ApiProperty } from "@nestjs/swagger";
import { CreateTaskDto } from "./create-task.dto";
import { Task } from "./task.entity";

export class PaginatedTasksDto {
  @ApiProperty({ type: [CreateTaskDto] })
  data!: Task[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;
}
