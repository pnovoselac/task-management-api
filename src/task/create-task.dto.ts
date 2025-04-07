import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Priority, Status } from "./task.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({
    description: "Title of the task",
    example: "Complete Swagger documentation",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: "Description of the task",
    example: "Write detailed Swagger documentation for Task entity",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "Status of the task",
    enum: Status,
    example: Status.IN_PROGRESS,
  })
  @IsEnum(Status)
  status!: Status;

  @ApiProperty({
    description: "Priority of the task",
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsEnum(Priority)
  priority!: Priority;

  @ApiProperty({
    description: "Due date for the task",
    example: "2025-04-15T00:00:00.000Z",
  })
  @IsDate()
  dueDate!: Date;

  @ApiProperty({
    description: "ID of the project to which this task belongs",
    example: 1,
  })
  @IsNumber()
  projectId!: number;

  @ApiProperty({
    description: "ID of the owner assigned to this task",
    example: "MBYGntGr9yVowQxSTAGIH79yDnT2",
  })
  @IsString()
  ownerId!: string;
}
