import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Project, Visibility } from "../../project/project.entity";
import { Task } from "../../task/task.entity";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const project = em.create(Project, {
      id: 6,
      title: "seeder projekt",
      description: "ovo će biti opis za seeder project",
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "FrFQLm4TpNW8Fr5dEWqoJOh98MI2",
      members: ["yFWKurA0NPPfAKxa4y1my80vD262", "TP31w6fTTdResMFhzCnTJUd8tw33"],
      visibility: Visibility.PRIVATE,
    });
    em.create(Task, {
      id: 15,
      title: "novi task1 ",
      status: "To Do",
      priority: "Low",
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "yFWKurA0NPPfAKxa4y1my80vD262",
      project,
      attachmentFileUrls: [],
    });
    em.create(Task, {
      id: 16,
      title: "novi task2 ",
      status: "To Do",
      priority: "Low",
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "yFWKurA0NPPfAKxa4y1my80vD262",
      project,
      attachmentFileUrls: [],
    });
    em.create(Task, {
      id: 17,
      title: "novi task3 ",
      status: "To Do",
      priority: "Low",
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "TP31w6fTTdResMFhzCnTJUd8tw33",
      project,
      attachmentFileUrls: [],
    });
  }
}
