import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FileRepository } from "./file.repository";
import { Task } from "../task/task.entity";
import { File } from "./file.entity";

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFile(task: Task, fileUrl: string): Promise<File> {
    try {
      const file = this.fileRepository.create({ task, url: fileUrl });
      await this.fileRepository.persistAndFlush(file);
      return file;
    } catch (error) {
      throw new HttpException("Error creating file", HttpStatus.BAD_REQUEST);
    }
  }

  async getFilesForTask(taskId: number): Promise<string[]> {
    const files = await this.fileRepository.getFilesByTask(taskId);
    return files.map((file) => file.url);
  }

  async deleteFile(fileId: number): Promise<void> {
    const file = await this.fileRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }
    await this.fileRepository.deleteFile(fileId);
  }
}
