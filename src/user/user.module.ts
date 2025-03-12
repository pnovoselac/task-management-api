import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { AuthService } from "auth/auth.service";

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
