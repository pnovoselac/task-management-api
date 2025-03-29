import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Priority, Status } from "./task.entity";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(Status)
  status!: Status;

  @IsEnum(Priority)
  priority!: Priority;

  @IsDate()
  dueDate!: Date;

  @IsNumber()
  projectId!: number;

  @IsString()
  ownerId!: string;
}
