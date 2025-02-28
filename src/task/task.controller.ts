import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';

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

  @Get('/project/:projectId')
  async findTasksByProject(@Param('projectId') projectId: number) {
    return await this.taskService.findTasksByProject(projectId);
  }

  @Get('priority/:priority')
  async findTasksByPriority(@Param('priority') priority: string){
    return await this.taskService.findTasksByPriority(priority);
  }

  @Get('status/:status')
  async findTasksByStatus(@Param('status') status: string){
    return await this.taskService.findTasksByStatus(status);
  }

  @Get('due_date/:dueDate')
  async findTasksByDueDate(@Param('dueDate') dueDate: Date){
    return await this.taskService.findTasksByDueDate(dueDate);
  }
}
