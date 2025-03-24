import { Injectable, NotFoundException } from "@nestjs/common";
import { FileRepository } from "./file.repository";
import { Task } from "../task/task.entity";
import { File } from "./file.entity";

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFile(task: Task, fileUrl: string): Promise<File> {
    try {
      console.log("Creating file entity...");
      const file = this.fileRepository.create({ task, url: fileUrl });
      console.log("File entity created:", file);

      await this.fileRepository.persistAndFlush(file);
      console.log("File entity persisted successfully:", file);

      return file;
    } catch (error) {
      console.error("Error creating file record:", error);
      throw new Error(`Error creating file:}`);
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
