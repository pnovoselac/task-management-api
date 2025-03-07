
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';
import { Project } from './project.entity';

@Controller('projects')
export class ProjectController { 
    constructor(private readonly projectService: ProjectService){}

    @Post()
    async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project>{
        return this.projectService.createproject(createProjectDto);
    }

    @Get()
    async findAllProjects(){
        return await this.projectService.findAllProjects();
    }

    @Get(':id')
    async findProjectById(@Param('id') id:number): Promise<Project | null>{
        return await this.projectService.findProjectById(id);
    }

    @Patch('id')
    async updateProject(@Param('id') id:number, @Body() updates: Partial<Project>):Promise<Project | null>{
        return this.projectService.updateProject(id,updates);
    }

    @Delete('id')
    async deleteProject(@Param('id') id:number):Promise<boolean>{
        return this.projectService.deleteProject(id);
    }

    
}
