import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateProjectDto } from "./project.dto";
import { Project } from "./project.entity";

export class PaginationQueryDto {
  @ApiProperty({ description: "Set wanted page number" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: "Set number of projects to be shown",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;
}
