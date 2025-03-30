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
  Request,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./project.dto";
import { Project } from "./project.entity";
import { AuthGuard } from "../auth/auth.guard";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req
  ): Promise<Project> {
    const user = req.user;
    return this.projectService.createProject(createProjectDto, user.uid);
  }

  @Post(":id/members")
  async addMembersToProject(
    @Param("id") projectId: number,
    @Body("memberIds") memberIds: string[]
  ): Promise<Project> {
    return this.projectService.addMembersToProject(projectId, memberIds);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllProjects(@Request() req): Promise<Project[]> {
    const user = req.user;
    return await this.projectService.findAllProjects(user?.uid);
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
    @Body() updates: Partial<Project>,
    @Request() req
  ): Promise<Project | null> {
    const user = req.user;
    return this.projectService.updateProject(id, updates, user.uid);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async softDeleteProject(
    @Param("id") id: number,
    @Request() req
  ): Promise<void> {
    const user = req.user;
    await this.projectService.softDeleteProject(id, user.uid);
  }
}
