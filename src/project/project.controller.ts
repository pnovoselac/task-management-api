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
import { UpdateProjectDto } from "./update-project.dto";
import { AuthGuard } from "../auth/auth.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

@Controller("projects")
@ApiBearerAuth("access-token")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Create new project" })
  @ApiResponse({
    status: 201,
    description: "Project created successfuly",
  })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req
  ): Promise<Project> {
    const user = req.user;
    return this.projectService.createProject(createProjectDto, user.uid);
  }

  @Post(":id/members")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Add members to project" })
  @ApiParam({
    name: "id",
    type: Number,
    example: 1,
  })
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        memberIds: {
          type: "array",
          items: { type: "string" },
          example: [
            "9709bc14-8b62-4771-a8e1-9548289371af",
            "c54d0bf8-d32c-44ef-bb08-bef741589629",
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Succesfully added members",
  })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({
    status: 404,
    description: "Project or users can not be found",
  })
  async addMembersToProject(
    @Param("id") projectId: number,
    @Body("memberIds") memberIds: string[]
  ): Promise<Project | undefined> {
    return await this.projectService.addMembersToProject(projectId, memberIds);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get all projects" })
  @ApiResponse({
    status: 200,
    description: "Projects found",
  })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  async findAllProjects(@Request() req): Promise<Project[]> {
    const user = req.user;
    return await this.projectService.findAllProjects(user?.uid);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get project by ID" })
  @ApiParam({ name: "id", description: "Project ID", type: Number })
  @ApiResponse({ status: 200, description: "Project found" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({ status: 404, description: "Project can not be found" })
  async findProjectById(@Param("id") id: number): Promise<Project | null> {
    return await this.projectService.findProjectById(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Project update" })
  @ApiParam({ name: "id", description: "Project ID", type: Number })
  @ApiResponse({
    status: 200,
    description: "Project updated successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({
    status: 403,
    description: "Unauthorized-you are not project owner",
  })
  async updateProject(
    @Param("id") id: number,
    @Body() updates: UpdateProjectDto,
    @Request() req
  ): Promise<Project | null> {
    const user = req.user;
    return this.projectService.updateProject(id, updates, user.uid);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Delete project (soft delete)" })
  @ApiParam({ name: "id", description: "Project ID", type: Number })
  @ApiResponse({ status: 200, description: "Project deleted successfuly" })
  @ApiResponse({ status: 401, description: "Unauthorized access" })
  @ApiResponse({
    status: 403,
    description: "Unauthorized-you are not project owner",
  })
  async softDeleteProject(
    @Param("id") id: number,
    @Request() req
  ): Promise<void> {
    const user = req.user;
    await this.projectService.softDeleteProject(id, user.uid);
  }
}
