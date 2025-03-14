import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Task } from "./task.entity";
import { Project } from "../project/project.entity";
import { User } from "../user/user.entity";

@Injectable()
export class TaskRepository extends EntityRepository<Task> {
  persist(entity: AnyEntity | AnyEntity[]): EntityManager {
    return this.em.persist(entity);
  }

  async persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void> {
    await this.em.persistAndFlush(entity);
  }

  remove(entity: AnyEntity): EntityManager {
    return this.em.remove(entity);
  }

  async removeAndFlush(entity: AnyEntity): Promise<void> {
    await this.em.removeAndFlush(entity);
  }

  async flush(): Promise<void> {
    return this.em.flush();
  }

  async findProjectById(projectId: number): Promise<Project> {
    return await this.em.findOneOrFail(Project, { id: projectId });
  }

  async findOwnerById(ownerId: string): Promise<User> {
    return await this.em.findOneOrFail(User, { id: ownerId });
  }
}
