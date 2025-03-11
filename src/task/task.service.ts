import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { FirebaseStorageService } from '../firebase/firebase.storage.service';
import { FilterQuery } from '@mikro-orm/core';
import { ITaskFilters } from './taskfilters';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository,
    private readonly firebaseStorageService : FirebaseStorageService
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.taskRepository.findProjectById(createTaskDto.projectId)
    const owner = await this.taskRepository.findOwnerById(createTaskDto.ownerId)
    const task = this.taskRepository.create({
    ...createTaskDto,
    project,
    owner
    });
    await this.taskRepository.persistAndFlush(task);
    return task;
  }
  
  async findAllTasks(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }
  

  async filterTasksBy(filters: ITaskFilters): Promise<Task[]> {
    const query: FilterQuery<Task> = {};
  
    if (filters.owner) query.owner=filters.owner;
    if (filters.project) query.project=filters.project;
    if (filters.priority) query.priority = filters.priority;
    if (filters.status) query.status = filters.status;
    if (filters.dueDate) query.dueDate = filters.dueDate;
  
    return await this.taskRepository.find(query);
  }

  async addAttachementFile(taskId: number, file: Express.Multer.File): Promise<any> {
    const task = await this.taskRepository.findOne(taskId);
    if(!task){
      throw new NotFoundException(`Task with ${taskId} not found!`);
    }

    const fileUrl = await this.firebaseStorageService.uploadFile(file, taskId);
    task.attachmentFileUrl= fileUrl;
    await this.taskRepository.persistAndFlush(task);

    return task;
  }
}
