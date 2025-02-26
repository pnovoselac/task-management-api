import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config'; 
import { Task } from './entities/task/task.entity';
import { TaskController } from './entities/task/task.controller';
import { TaskService } from './entities/task/task.service';
import { TaskRepository } from './data-access/repositories/task.repository';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig), 
    MikroOrmModule.forFeature([Task]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports:[TaskRepository]
})
export class AppModule {}
