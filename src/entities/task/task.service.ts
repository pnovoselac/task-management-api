import { Injectable, Post } from '@nestjs/common';
import { TaskRepository } from 'src/data-access/repositories/task.repository';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { CreateTaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description || null,
      status: createTaskDto.status || 'To Do',
      priority: createTaskDto.priority || 'Low',
      dueDate: createTaskDto.dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.taskRepository.upsert(task);
  }

  async findAllTasks() {
    return await this.taskRepository.findAllTasks();
  }
  
}
