import { User } from "user/user.entity";
import { Visibility } from "./project.entity";

export class CreateProjectDto {
  title!: string;
  description!: string;
  owner!: User;
  visibility!: Visibility;
}
