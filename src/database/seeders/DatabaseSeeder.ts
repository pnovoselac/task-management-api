import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/core";
import { Project, Visibility } from "../../project/project.entity";
import { User } from "../../user/user.entity";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AuthService } from "../../auth/auth.service";
import { Priority, Status, Task } from "../../task/task.entity";

export class DatabaseSeeder extends Seeder {
  constructor() {
    super();
  }
  async run(em: EntityManager): Promise<void> {
    const email = "userprvi@example.com";
    const password = "Lozinka123";

    const app = await NestFactory.create(AppModule);
    const authService = app.get(AuthService);

    try {
      let localUser = await em.findOne(User, { email });
      if (!localUser) {
        const firebaseUser = await authService.registerUser(email, password);

        localUser = em.create(User, {
          id: firebaseUser.uid,
          email: firebaseUser.email,
        });

        await em.persistAndFlush(localUser);
      }

      const project = em.create(Project, {
        title: "Seeder projekt",
        description: "Ovo će biti opis za seeder projekt",
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: localUser.id,
        members: [],
        visibility: Visibility.PUBLIC,
      });

      const task = em.create(Task, {
        title: "taskić",
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        project: project,
        owner: localUser.id,
      });

      await em.persistAndFlush([task, project]);
    } finally {
      await app.close();
    }
  }
}
