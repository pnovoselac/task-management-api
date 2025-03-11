import {
  AnyEntity,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { RegisterUserDto } from "./register-user.dto";

@Injectable()
export class UserRepository extends EntityRepository<User> {
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
