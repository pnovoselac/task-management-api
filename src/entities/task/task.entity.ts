import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { TaskRepository } from 'src/data-access/repositories/task.repository';

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

  @Property({ onCreate: () => new Date() }) // Automatically set when the entity is created
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() }) // Automatically set on create and update
  updatedAt!: Date;
}
