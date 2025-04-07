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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { ApiTaskQueries } from "../swagger/api.task.queries";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiBody({
    type: CreateTaskDto,
    description: "The data required to create a new task",
  })
  @ApiResponse({
    status: 201,
    description: "The task has been successfully created",
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all tasks or filter tasks" })
  @ApiTaskQueries()
  @ApiResponse({
    status: 200,
    description: "List of tasks matching the filters",
    type: [Task],
  })
  async findAllTasks(@Query() filters: ITaskFilters): Promise<Task[]> {
    if (Object.keys(filters).length > 0) {
      return await this.taskService.filterTasksBy(filters);
    }
    return await this.taskService.findAllTasks();
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
          description: "The file to attach",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File successfully attached to the task",
    example: {
      id: 18,
      title: "Little task",
      description: null,
      status: "In Progress",
      priority: "Medium",
      ownerId: "P0ig64TxsnbeOC5UB8L7Yx6Duw1",
      files: [
        {
          id: 1,
          url: "https://storage.googleapis.com/task-management-api/tasks/18/file.pdf",
          createdAt: "2025-04-06T22:57:32.370Z",
        },
      ],
    },
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
