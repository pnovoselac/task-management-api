import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends EntityRepository<Task> {
}
