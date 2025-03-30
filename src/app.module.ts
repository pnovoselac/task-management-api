import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { TaskModule } from "./task/task.module";
import { ProjectModule } from "./project/project.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { FirebaseAdminModule } from "./firebase/firebase.admin.module";
import { FileModule } from "./file/file.module";
import { MikroOrmMiddleware } from "@mikro-orm/nestjs";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TaskModule,
    ProjectModule,
    FirebaseModule,
    UserModule,
    AuthModule,
    FirebaseAdminModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes("*");
  }
}
