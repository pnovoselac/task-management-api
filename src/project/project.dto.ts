import { User } from "user/user.entity";
import { Visibility } from "./project.entity";
import { IsEnum, isNotEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  owner!: User;

  @IsEnum(Visibility)
  visibility!: Visibility;
}
