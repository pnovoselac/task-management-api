import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Project, Visibility } from "./project.entity";
import { ProjectRepository } from "./project.repository";
import { CreateProjectDto } from "./project.dto";
import { FilterQuery, wrap } from "@mikro-orm/core";
import { User } from "../user/user.entity";
import { UpdateProjectDto } from "./update-project.dto";
import { PaginatedProjectsDto } from "./paginated-project.dto";
import { PaginationQueryDto } from "./pagination-project-query.dto";

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
    const owner = await this.projectRepository.findOwnerByFirebaseId(ownerId);
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

  async findAllProjects(
    userId?: string,
    pagination?: PaginationQueryDto
  ): Promise<PaginatedProjectsDto> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const offset = (page - 1) * limit;
    let query: FilterQuery<Project> = { deletedAt: null };

    if (userId) {
      const owner = await this.projectRepository.findOwnerByFirebaseId(userId);
      if (!owner) {
        throw new NotFoundException(`User ${owner} not found`);
      }
      query = {
        $or: [
          { visibility: Visibility.PUBLIC, deletedAt: null },
          { owner, deletedAt: null },
          { members: { $in: [owner] }, deletedAt: null },
        ],
      };
    } else {
      query = { visibility: Visibility.PUBLIC, deletedAt: null };
    }
    const [projects, total] = await this.projectRepository.findAndCount(query, {
      limit,
      offset,
      populate: ["members", "tasks"],
    });

    return {
      data: projects,
      page,
      total,
    };
  }

  async findProjectById(id: number): Promise<Project | null> {
    const project = await this.projectRepository.findOne(
      { id, deletedAt: null },
      { populate: ["members", "tasks"] }
    );
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    ownerId: string
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    const owner = await this.projectRepository.findOwnerByFirebaseId(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    if (project.owner !== owner) {
      throw new ForbiddenException("You are not owner of this project");
    }

    wrap(project).assign(updateProjectDto);
    await this.projectRepository.flush();
    return project;
  }
  async addMembersToProject(
    projectId: number,
    memberIds: string[]
  ): Promise<Project | undefined> {
    if (await this.findProjectById(projectId)) {
      const members = await this.projectRepository.findMembersById(memberIds);

      if (members.length !== memberIds.length) {
        throw new NotFoundException("One or more users not found");
      }
      return await this.projectRepository.addMembersToProject(
        projectId,
        members
      );
    }
  }

  async softDeleteProject(id: number, ownerId: string): Promise<void> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found, cant delete nonexisted project`
      );
    }
    const owner = await this.projectRepository.findOwnerByFirebaseId(ownerId);
    if (!owner) {
      throw new NotFoundException(`User with ID ${ownerId} not found`);
    }
    if (project.owner !== owner) {
      throw new ForbiddenException("You are not owner of this project");
    }
    project.deletedAt = new Date();
    await this.projectRepository.persistAndFlush(project);
  }
}
