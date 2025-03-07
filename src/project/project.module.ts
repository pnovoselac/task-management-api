import { Module } from '@nestjs/common';
import { Project } from './project.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';


@Module({     
    imports: [MikroOrmModule.forFeature({entities: [Project]})],
    controllers: [ProjectController], 
    providers: [ProjectRepository, ProjectService],
    exports:[ProjectRepository,ProjectService]
})
export class ProjectModule {}
