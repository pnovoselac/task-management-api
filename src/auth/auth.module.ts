import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "user/user.module";
import { HttpModule } from "@nestjs/axios";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [UserModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
