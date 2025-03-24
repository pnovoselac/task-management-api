import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { File } from "./file.entity";

@Injectable()
export class FileRepository extends EntityRepository<File> {
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

  async getFilesByTask(taskId: number): Promise<File[]> {
    return await this.em.find(File, { task: taskId });
  }

  async deleteFile(fileId: number): Promise<void> {
    const file = await this.findOne(fileId);
    if (file) {
      await this.em.removeAndFlush(file);
    }
  }
}
