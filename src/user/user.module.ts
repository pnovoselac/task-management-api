import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { AuthService } from "auth/auth.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [MikroOrmModule.forFeature([User]), HttpModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
