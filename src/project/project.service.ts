import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Project, Visibility } from "./project.entity";
import { ProjectRepository } from "./project.repository";
import { CreateProjectDto } from "./project.dto";
import { wrap } from "@mikro-orm/core";
import { User } from "../user/user.entity";

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
    const project = this.projectRepository.create({
      ...createProjectDto,
      owner,
    });
    await this.projectRepository.persistAndFlush(project);
    owner.ownedProjects.add(project);
    await this.projectRepository.persistAndFlush(owner);
    return project;
  }

  async findAllProjects(userId?: string): Promise<Project[]> {
    if (userId) {
      return await this.projectRepository.find({
        $or: [
          { visibility: Visibility.PUBLIC },
          { owner: userId },
          { members: { $in: [userId] } },
        ],
      });
    }
    return await this.projectRepository.find({ visibility: Visibility.PUBLIC });
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.projectRepository.findOne(
      { id },
      { populate: ["tasks"] }
    );
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async updateProject(
    id: number,
    updates: Partial<Project>,
    userId: string
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    if (project.owner.id !== userId) {
      throw new ForbiddenException("You are not the owner of this project");
    }

    wrap(project).assign(updates);
    await this.projectRepository.flush();
    return project;
  }
  async addMembersToProject(
    projectId: number,
    memberIds: string[]
  ): Promise<Project> {
    const members = await this.projectRepository.findMembersById(memberIds);

    if (members.length !== memberIds.length) {
      throw new NotFoundException("One or more users not found");
    }
    return this.projectRepository.addMembersToProject(projectId, members);
  }
  async deleteProject(id: number, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({ id });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found, cant delete nonexisted project`
      );
    }
    if (project.owner.id !== userId) {
      throw new ForbiddenException("You are not the owner of this project");
    }

    await this.projectRepository.removeAndFlush(project);
  }
}
