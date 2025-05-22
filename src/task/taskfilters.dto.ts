import {
  IsOptional,
  IsEnum,
  IsInt,
  IsDate,
  ValidateIf,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { Priority, Status } from "./task.entity";

export class TaskFilterDto {
  @IsOptional()
  owner?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "project must be a number" })
  project?: number;

  @IsOptional()
  @IsEnum(Priority, { message: "priority must be Low, Medium, or High" })
  priority?: Priority;

  @IsOptional()
  @IsEnum(Status, {
    message: "status must be To Do, In Progress, or Completed",
  })
  status?: Status;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "dueDate must be a valid date" })
  dueDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
