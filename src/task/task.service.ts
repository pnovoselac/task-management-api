import { Injectable, NotFoundException, Post } from "@nestjs/common";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Priority, Task } from "./task.entity";
import { CreateTaskDto } from "./create-task.dto";
import { FirebaseStorageService } from "../firebase/firebase.storage.service";
import { FilterQuery, wrap } from "@mikro-orm/core";
import { TaskFilterDto } from "./taskfilters.dto";
import { PaginatedTasksDto } from "./paginated-tasks.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository,
    private readonly firebaseStorageService: FirebaseStorageService
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    ownerId: string
  ): Promise<Task> {
    const owner = await this.taskRepository.findOwnerByFirebaseId(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    const project = await this.taskRepository.findProjectById(
      createTaskDto.projectId
    );

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

  async filterTasksBy(filters: TaskFilterDto): Promise<PaginatedTasksDto> {
    const query: FilterQuery<Task> = { deletedAt: null };
    if (filters.owner != null) {
      try {
        await this.taskRepository.findOwnerById(String(filters.owner));
      } catch (e) {
        throw new NotFoundException("Owner doesn't exist");
      }
    }
    if (filters.project != null) {
      try {
        await this.taskRepository.findProjectById(Number(filters.project));
      } catch (e) {
        throw new NotFoundException("Project doesn't exist");
      }
    }

    if (filters.owner) query.owner = filters.owner;
    if (filters.project) query.project = filters.project;
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;
    if (filters.dueDate) query.dueDate = filters.dueDate;

    const page = filters.page || 1;
    const limit = filters.limit || 1;
    const [tasks, total] = await this.taskRepository.findAndCount(query, {
      limit,
      offset: (page - 1) * limit,
      populate: ["files"],
    });
    return {
      data: tasks,
      total,
      page,
    };
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
