import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@mikro-orm/nestjs";
import { RegisterUserDto } from "./register-user.dto";
import * as admin from "firebase-admin";
import { LoginUserDto } from "./login-user.dto";
import { AuthService } from "auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly firebaseAuthService: AuthService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({ ...createUserDto });
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      console.log("Register DTO:", registerUserDto);
      const firebaseUser = await this.firebaseAuthService.registerUser(
        registerUserDto.email,
        registerUserDto.password
      );
      const user = this.createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
      });
      return user;
    } catch (error) {
      throw new Error("User registration failed");
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return this.firebaseAuthService.loginUser(
      loginUserDto.email,
      loginUserDto.password
    );
  }
}
