import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User password (min 6 characters)",
    example: "Secret123",
    minLength: 6,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
