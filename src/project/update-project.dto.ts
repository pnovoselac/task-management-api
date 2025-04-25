import { User } from "user/user.entity";
import { Visibility } from "./project.entity";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProjectDto {
  @ApiProperty({
    description: "Project name",
    example: "Task Management API",
    required: true,
  })
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: "Project description",
    example: "REST API for a task management application",
    required: true,
  })
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: "Project visibility",
    enum: Visibility,
    default: Visibility.PRIVATE,
    example: Visibility.PRIVATE,
  })
  @IsEnum(Visibility)
  visibility!: Visibility;

  @IsDate()
  deletedAt!: null;
}
