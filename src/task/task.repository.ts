import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./task.entity";
import { Project } from "../project/project.entity";
import { User } from "../user/user.entity";
import { File } from "../file/file.entity";

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
  async findOwnerByFirebaseId(ownerId: string): Promise<User> {
    return await this.em.findOneOrFail(User, { firebaseId: ownerId });
  }

  async attachFile(taskId: number, fileUrl: string): Promise<Task> {
    const task = await this.findOne(taskId, { populate: ["files"] });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    const file = this.em.create(File, { url: fileUrl, task });
    await this.em.persistAndFlush(file);
    task.files.add(file);
    await this.flush();

    return task;
  }

  async getFilesForTask(taskId: number): Promise<string[]> {
    const task = await this.findOne(taskId, { populate: ["files"] });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task.files.getItems().map((file) => file.url);
  }
}
