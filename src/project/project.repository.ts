import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Project } from "./project.entity";

@Injectable()
export class ProjectRepository extends EntityRepository<Project> {
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
}
