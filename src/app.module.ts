import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module.js";
import { TaskModule } from "./task/task.module.js";
import { ProjectModule } from "./project/project.module.js";
import { FirebaseModule } from "./firebase/firebase.module";
import { UserModule } from "./user/user.module.js";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TaskModule,
    ProjectModule,
    FirebaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
