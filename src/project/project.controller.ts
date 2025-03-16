import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./project.dto";
import { Project } from "./project.entity";
import { AuthGuard } from "auth/auth.guard";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Query("ownerId") ownerId: string
  ): Promise<Project> {
    return this.projectService.createProject(createProjectDto, ownerId);
  }

  @Post(":projectId/add-members")
  async addMembers(
    @Param("projectId") projectId: number,
    @Body("memberIds") memberIds: string[]
  ): Promise<Project> {
    return await this.projectService.addMembersToProject(projectId, memberIds);
  }

  @Get()
  async findAllProjects() {
    return await this.projectService.findAllProjects();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findProjectById(@Param("id") id: number): Promise<Project | null> {
    return await this.projectService.findProjectById(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateProject(
    @Param("id") id: number,
    @Body() updates: Partial<Project>
  ): Promise<Project | null> {
    return this.projectService.updateProject(id, updates);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteProject(
    @Param("id") id: number
  ): Promise<{ statusCode: number; message: string }> {
    return this.projectService.deleteProject(id);
  }
}
