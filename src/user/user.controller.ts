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
import { RegisterUserDto } from "./register-user.dto";
import { LoginUserDto } from "./login-user.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.userService.registerUser(registerUserDto);
    return { email: user.email, id: user.id };
  }

  @Post("login")
  @ApiOperation({ summary: "Login a user" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all active users" })
  @ApiBearerAuth("access-token")
  @ApiResponse({
    status: 200,
    description: "List of all active users",
  })
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a user by ID" })
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "id",
    description: "Unique identifier for the user (UID)",
  })
  @ApiResponse({
    status: 200,
    description: "User found",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  findOne(@Param("id") id: string) {
    return this.userService.findUserById(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete user" })
  @ApiBearerAuth("access-token")
  @ApiParam({
    name: "id",
    description: "Unique identifier for the user (UID)",
  })
  @ApiResponse({
    status: 200,
    description: "User successfully soft deleted",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  softDelete(@Param("id") id: string) {
    return this.userService.softDeleteUser(id);
  }
}
