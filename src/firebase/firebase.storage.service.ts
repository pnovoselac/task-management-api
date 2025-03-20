import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

@Injectable()
export class FirebaseStorageService {
  constructor(
    @Inject("FirebaseStorage")
    private readonly bucket
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    destination: string
  ): Promise<string> {
    try {
      const fileUpload = this.bucket.file(destination);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      await fileUpload.makePublic();
      return fileUpload.publicUrl();
    } catch (error) {
      throw new HttpException(
        "Cant load file.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllFilesForTask(taskId: number): Promise<string[]> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: `tasks/${taskId}/`,
      });
      return files.map((file) => file.publicUrl());
    } catch (error) {
      throw new HttpException(
        "Cant load files.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
