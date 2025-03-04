import { Project } from "src/project/project.entity";

export class CreateTaskDto {
    title!: string;
    description!: string;
    status!: string;
    priority!: string;
    dueDate!: Date;
    projectId!: number;
    createdAt: Date;
    updatedAt: Date;
  }
  