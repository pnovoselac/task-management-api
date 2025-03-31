import { Injectable, NotFoundException, Post } from "@nestjs/common";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./create-task.dto";
import { FirebaseStorageService } from "../firebase/firebase.storage.service";
import { FilterQuery, wrap } from "@mikro-orm/core";
import { ITaskFilters } from "./taskfilters";
import { populate } from "dotenv";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository,
    private readonly firebaseStorageService: FirebaseStorageService
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.taskRepository.findProjectById(
      createTaskDto.projectId
    );
    const owner = await this.taskRepository.findOwnerById(
      createTaskDto.ownerId
    );
    console.log(owner);

    const task = this.taskRepository.create({
      ...createTaskDto,
      project,
      owner,
    });

    await this.taskRepository.persistAndFlush(task);
    return task;
  }

  async findAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find(
      { deletedAt: null },
      { populate: ["files"] }
    );
  }

  async filterTasksBy(filters: ITaskFilters): Promise<Task[]> {
    const query: FilterQuery<Task> = { deletedAt: null };

    if (filters.owner) query.owner = filters.owner;
    if (filters.project) query.project = filters.project;
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;
    if (filters.dueDate) query.dueDate = filters.dueDate;

    return await this.taskRepository.find(query);
  }
  async attachFile(taskId: number, file: Express.Multer.File): Promise<Task> {
    const task = await this.taskRepository.find(
      { $and: [{ id: taskId }, { deletedAt: null }] },
      { populate: ["files"] }
    );

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const destination = `tasks/${taskId}/${Date.now()}-${file.originalname}`;
    const fileUrl = await this.firebaseStorageService.uploadFile(
      file,
      destination
    );
    return await this.taskRepository.attachFile(taskId, fileUrl);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, deletedAt: null });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    wrap(task).assign(updates);
    await this.taskRepository.persistAndFlush(task);
    return task;
  }

  async softDeleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ id, deletedAt: null });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    task.deletedAt = new Date();
    await this.taskRepository.persistAndFlush(task);
  }
}
