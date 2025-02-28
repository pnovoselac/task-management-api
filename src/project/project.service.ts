import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto } from './project.dto';
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: ProjectRepository,
  ) {}

  async createproject(createProjectDto: CreateProjectDto): Promise<Project> {
      const project = this.projectRepository.create({
      ...createProjectDto,
      });
    return await this.projectRepository.upsert(project);
  }

  async findAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll({ populate: ['tasks'] });
  }

  async findProjectById(id: number): Promise<Project | null> {
    return await this.projectRepository.findOne({ id }, { populate: ['tasks'] });
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | null> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) return null;

    Object.assign(project, updates);
    await this.projectRepository.persist(project).flush();
    return project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) return false;

    await this.projectRepository.removeAndFlush(project);
    return true;
  }
}
