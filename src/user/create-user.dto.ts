import { IsDate, IsEmail, IsNotEmpty, IsUUID } from "class-validator";

export class CreateUserDto {
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsDate()
  deletedAt!: null;
}
