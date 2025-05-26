import { ApiProperty } from "@nestjs/swagger";
import { CreateProjectDto } from "./project.dto";
import { Project } from "./project.entity";

export class PaginatedProjectsDto {
  @ApiProperty({ type: [CreateProjectDto] })
  data!: Project[];
  page!: number;
  total!: number;
}
