import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { FirebaseStorageService } from '../firebase/firebase.storage.service';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

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

  async filterTasks(filters:{ownerId?:string; projectId?:number; priority?:string; status?:string; dueDate?:Date}){
    const query: any={};
    if (filters.ownerId) query['owner'] = { ownerId: filters.ownerId} ;
    if (filters.projectId) query['project'] = { projectId: filters.projectId };
    if (filters.priority) query['priority'] = filters.priority;
    if (filters.status) query['status'] = filters.status;
    if (filters.dueDate) query['dueDate'] = filters.dueDate;

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
