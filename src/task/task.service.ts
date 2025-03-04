import { Injectable, Post } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { Project } from 'src/project/project.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: TaskRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.taskRepository.findProjectById(createTaskDto.projectId)
    const task = this.taskRepository.create({
    ...createTaskDto,
    project
    });
    await this.taskRepository.persistAndFlush(task);
    return task;
  }
  
  async findAllTasks(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async findTasksByProject(projectId: number): Promise<Task[]> {
    return await this.taskRepository.find({ project: projectId });
  }
  
  async findTasksByPriority(priority: string): Promise<Task[]>{
    return await this.taskRepository.find({ priority: priority});
  }

  //TODO-findTasksByUser 

  async findTasksByStatus(status: string): Promise<Task[]>{
    return await this.taskRepository.find({status: status});
  }

  async findTasksByDueDate(due_date: Date): Promise<Task[]>{
    return await this.taskRepository.find({dueDate: due_date})
  }
}
