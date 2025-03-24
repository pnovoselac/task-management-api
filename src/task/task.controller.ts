import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
  NotFoundException,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.entity.js";
import { CreateTaskDto } from "./create-task.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ITaskFilters } from "./taskfilters";
import { UpdateTaskDto } from "./update-task.dto";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  async findAllTasks(@Query() filters: ITaskFilters) {
    if (Object.keys(filters).length > 0) {
      return await this.taskService.filterTasksBy(filters);
    }
    return await this.taskService.findAllTasks();
  }

  @Post(":id/attach-file")
  @UseInterceptors(FileInterceptor("file"))
  async attachFileToTask(
    @Param("id") id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    if (!file) {
      throw new NotFoundException("No file provided");
    }

    const task = await this.taskService.attachFile(id, file);
    return {
      task,
    };
  }

  @Patch(":id")
  async updateTask(
    @Param("id") id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(":id")
  async deleteTask(@Param("id") id: number) {
    return this.taskService.deleteTask(id);
  }
}
