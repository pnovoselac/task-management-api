import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { FileService } from "../file/file.service";
import { Task } from "../task/task.entity";

@Injectable()
export class FirebaseStorageService {
  constructor(
    @Inject("FirebaseStorage") private readonly bucket,
    private readonly fileService: FileService
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    destination: string
  ): Promise<string> {
    try {
      const fileUpload = this.bucket.file(destination);

      console.log("Uploading file to Firebase Storage...");
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      await fileUpload.makePublic();

      const publicUrl = fileUpload.publicUrl();
      console.log("File uploaded successfully to Firebase:", publicUrl);

      return publicUrl;
    } catch (error) {
      console.error("Error during file upload:", error);
      throw new HttpException(
        "Can't upload file.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
