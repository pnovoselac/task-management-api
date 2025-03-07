import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { Task } from './task.entity.js';
import { CreateTaskDto } from './task.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('filter')
  async filterTasks(@Query('projectId') projectId:number, @Query('priority') priority: string, @Query('status') status: string, @Query('due_date') dueDate: Date){
    return await this.taskService.filterTasks({projectId, priority, status, dueDate});
  }

  @Post(':id/attachment')
  @UseInterceptors(FileInterceptor('file'))
  async addAttachmentFile(@Param('id') taskId: number, @UploadedFile() file: Express.Multer.File,): Promise<any> {
    return this.taskService.addAttachementFile(taskId, file)
  }
}
