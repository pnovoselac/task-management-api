import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TaskRepository } from './task/task.repository';
import { TaskModule } from './task/task.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    TaskModule,
  ],
  controllers: [TaskController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule {}
