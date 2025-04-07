import { User } from "user/user.entity";
import { Visibility } from "./project.entity";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
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
    description: "ID of project owner",
    required: true,
    example: "UtUvq2KRQgUWIhR3nyE02DKGGtR2",
  })
  @IsNotEmpty()
  owner!: User;

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
