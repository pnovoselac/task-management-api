import { User } from "user/user.entity";

export class CreateProjectDto {
  title!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
  owner!: User;
}
