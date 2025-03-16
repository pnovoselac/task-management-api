import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { Project } from "project/project.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  project!: Project;
}
