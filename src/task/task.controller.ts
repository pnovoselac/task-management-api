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
  Request,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.entity.js";
import { CreateTaskDto } from "./create-task.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { ApiTaskQueries } from "../swagger/api.task.queries";
import { AuthGuard } from "../auth/auth.guard";
import { TaskFilterDto } from "./taskfilters.dto";
import { PaginatedTasksDto } from "./paginated-tasks.dto";

@Controller("tasks")
@ApiBearerAuth("access-token")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Create a new task" })
  @ApiBody({
    type: CreateTaskDto,
    description: "The data required to create a new task",
  })
  @ApiResponse({
    status: 201,
    description: "The task has been successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req
  ): Promise<Task> {
    const user = req.user;
    return await this.taskService.createTask(createTaskDto, user.uid);
  }

  @Get()
  @ApiTaskQueries()
  @ApiResponse({
    status: 200,
    description: "List of tasks matching the filters",
    type: PaginatedTasksDto,
  })
  async findAllTasks(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filters: TaskFilterDto
  ): Promise<PaginatedTasksDto> {
    return await this.taskService.filterTasksBy(filters);
  }

  @Post(":id/attach-file")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Attach a file to a task" })
  @ApiParam({
    name: "id",
    description: "ID of the task to which the file will be attached",
    type: Number,
    example: 18,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "File to attach to the task",
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The file to attach (PDF or image)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File successfully attached to the task",
  })
  @ApiResponse({
    status: 404,
    description: "Task not found or no file provided",
  })
  async attachFileToTask(
    @Param("id") id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Task> {
    if (!file) {
      throw new NotFoundException("No file provided");
    }
    const task = await this.taskService.attachFile(id, file);
    return task;
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a task" })
  @ApiParam({
    name: "id",
    description: "ID of the task to be updated",
    type: Number,
    example: 18,
  })
  @ApiBody({
    description: "Fields to update in the task",
    required: true,
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Updated Task Title" },
        description: { type: "string", example: "Updated Task Description" },
        status: {
          type: "string",
          enum: ["To Do", "In Progress", "Completed"],
          example: "Completed",
        },
        priority: {
          type: "string",
          enum: ["Low", "Medium", "High"],
          example: "High",
        },
        dueDate: {
          type: "string",
          format: "date-time",
          example: "2025-04-15T00:00Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Task successfully updated",
  })
  @ApiResponse({
    status: 404,
    description: "Task not found",
  })
  async updateTask(@Param("id") id: number, @Body() updates: Partial<Task>) {
    return this.taskService.updateTask(id, updates);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete task (doft delete)" })
  @ApiParam({
    name: "id",
    description: "ID of the task to be soft deleted",
    type: Number,
    example: 18,
  })
  @ApiResponse({
    status: 200,
    description: "Task successfully soft deleted",
  })
  @ApiResponse({
    status: 404,
    description: "Task not found",
  })
  async softDeleteTask(@Param("id") id: number): Promise<void> {
    await this.taskService.softDeleteTask(id);
  }
}
