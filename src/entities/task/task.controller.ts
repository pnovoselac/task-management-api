import { Controller, Get, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { create } from 'domain';
import { get } from 'http';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  async findAllTasks(){
    return await this.taskService.findAllTasks();
  }
}
