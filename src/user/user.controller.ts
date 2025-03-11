import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { RegisterUserDto } from "./register-user.dto";
import { User } from "./user.entity";
import { LoginUserDto } from "./login-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.registerUser(registerUserDto);
  }

  @Post("login")
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
