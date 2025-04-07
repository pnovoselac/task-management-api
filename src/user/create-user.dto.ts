import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "Firebase UID of the user",
    example: "P0ig64TxsnbeOC5UB8L7Yx6Duw1",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsDate()
  deletedAt!: null;
}
