import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskRepository } from 'src/data-access/repositories/task.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Task])],
  controllers: [TaskController], 
  providers: [TaskService, TaskRepository],
  exports:[TaskRepository]
})
export class TaskModule {}
