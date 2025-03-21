import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { TaskService } from "./task.service.js";
import { Task } from "./task.entity.js";
import { CreateTaskDto } from "./create-task.dto.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { ITaskFilters } from "./taskfilters.js";
import { filter } from "rxjs";

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

  @Post(":id/attachment")
  @UseInterceptors(FileInterceptor("file"))
  async addAttachmentFile(
    @Param("id") taskId: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    return this.taskService.addAttachementFile(taskId, file);
  }
}
