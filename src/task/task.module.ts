import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { FirebaseStorageService } from 'firebase/firebase.storage.service';

@Module({
  imports: [MikroOrmModule.forFeature({entities: [Task]})],
  controllers: [TaskController], 
  providers: [TaskService, TaskRepository, FirebaseStorageService],
  exports:[TaskService,TaskRepository]
})
export class TaskModule {}
