import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Task } from 'src/entities/task/task.entity';

@Injectable()
export class TaskRepository extends EntityRepository<Task> {

async findAllTasks() {
    return await this.findAll();
}
}
