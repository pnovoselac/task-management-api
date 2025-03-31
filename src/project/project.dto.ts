import { User } from "user/user.entity";
import { Visibility } from "./project.entity";
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  owner!: User;

  @IsEnum(Visibility)
  visibility!: Visibility;

  @IsDate()
  deletedAt!: null;
}
