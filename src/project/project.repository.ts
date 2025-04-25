import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Project } from "./project.entity";
import { User } from "../user/user.entity";

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
  async findOwnerByFirebaseId(ownerId: string): Promise<User> {
    return await this.em.findOneOrFail(User, { firebaseId: ownerId });
  }

  async findMembersById(memberIds: string[]): Promise<User[]> {
    return await this.em.find(User, { id: { $in: memberIds } });
  }

  async addMembersToProject(
    projectId: number,
    members: User[]
  ): Promise<Project> {
    const project = await this.findOneOrFail(
      { id: projectId },
      { populate: ["members"] }
    );

    for (const member of members) {
      if (!project.members.contains(member)) {
        project.members.add(member);
      }
    }

    await this.flush();
    return project;
  }
}
