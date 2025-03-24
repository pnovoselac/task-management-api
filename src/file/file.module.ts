import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { File } from "./file.entity";
import { FileRepository } from "./file.repository";
import { FileService } from "./file.service";

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  providers: [FileRepository, FileService],
  exports: [FileService],
})
export class FileModule {}
