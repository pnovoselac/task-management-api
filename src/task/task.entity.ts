import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { TaskRepository } from './task.repository';

@Entity({ repository: () => TaskRepository })
export class Task {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: 'To Do' })
  status!: string;

  @Property({ default: 'Low' })
  priority!: string;

  @Property({ nullable: true })
  dueDate?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;
}
