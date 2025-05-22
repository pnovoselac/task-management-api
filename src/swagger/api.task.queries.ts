import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Priority, Status } from "../task/task.entity";
import { Task } from "../task/task.entity";

export function ApiTaskQueries() {
  return applyDecorators(
    ApiOperation({ summary: "Retrieve all tasks or filter tasks" }),
    ApiQuery({
      name: "owner",
      required: false,
      type: String,
      description: "Filter tasks by owner ID",
    }),
    ApiQuery({
      name: "project",
      required: false,
      type: Number,
      description: "Filter tasks by project ID",
    }),
    ApiQuery({
      name: "priority",
      required: false,
      enum: Priority,
      description: "Filter tasks by priority (Low, Medium, High)",
    }),
    ApiQuery({
      name: "status",
      required: false,
      enum: Status,
      description: "Filter tasks by status (To Do, In Progress, Completed)",
    }),
    ApiQuery({
      name: "dueDate",
      required: false,
      type: Date,
      format: "date-time",
      description: "Filter tasks by due date",
    }),
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      description: "Set wanted page number",
    }),
    ApiQuery({
      name: "limit",
      required: false,
      type: Number,
      description: "Set number of tasks to be shown",
    })
  );
}
