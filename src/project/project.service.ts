import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Project } from "./project.entity";
import { ProjectRepository } from "./project.repository";
import { CreateProjectDto } from "./project.dto";
import { wrap } from "@mikro-orm/core";
import { NotFoundError } from "rxjs";
import { User } from "user/user.entity";
import { UserRepository } from "user/user.repository";
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    ownerId: string
  ): Promise<Project> {
    const owner = await this.projectRepository.findOwnerById(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    const project = await this.projectRepository.create({
      ...createProjectDto,
      owner,
    });
    await this.projectRepository.persistAndFlush(project);
    owner.ownedProjects.add(project);
    await this.projectRepository.persistAndFlush(owner);
    return project;
  }

  async findAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll({
      populate: ["tasks", "members"],
    });
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.projectRepository.findOne(
      { id },
      { populate: ["tasks", "members"] }
    );
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async updateProject(
    id: number,
    updates: Partial<Project>
  ): Promise<Project | null> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    wrap(project).assign(updates);
    await this.projectRepository.flush();
    return project;
  }
  async addMembersToProject(
    projectId: number,
    memberIds: string[]
  ): Promise<Project> {
    return await this.projectRepository.addMembersToProject(
      projectId,
      memberIds
    );
  }

  async deleteProject(
    id: number
  ): Promise<{ statusCode: number; message: string }> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.projectRepository.removeAndFlush(project);
    return {
      statusCode: 204,
      message: `Project with ID ${id} deleted successfully`,
    };
  }
}
