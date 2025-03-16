import { Module } from "@nestjs/common";
import { Project } from "./project.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectController } from "./project.controller";
import { ProjectRepository } from "./project.repository";
import { ProjectService } from "./project.service";
import { AuthModule } from "auth/auth.module";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Project] }), AuthModule],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
