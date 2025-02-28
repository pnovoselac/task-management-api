import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { TaskRepository } from './task.repository';
import { Project } from 'src/project/project.entity';

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
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(()=>Project)
  project!: Project;
}
