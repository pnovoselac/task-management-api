import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@mikro-orm/nestjs";
import { RegisterUserDto } from "./register-user.dto";
import * as admin from "firebase-admin";
import { LoginUserDto } from "./login-user.dto";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly firebaseAuthService: AuthService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ deletedAt: null });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id, deletedAt: null });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async softDeleteUser(id: string): Promise<User> {
    const user = await this.findUserById(id);
    user.deletedAt = new Date();
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const firebaseUser = await this.firebaseAuthService.registerUser(
      registerUserDto.email,
      registerUserDto.password
    );
    const user = this.createUser({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      deletedAt: null,
    });
    return user;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return this.firebaseAuthService.loginUser(
      loginUserDto.email,
      loginUserDto.password
    );
  }
}
