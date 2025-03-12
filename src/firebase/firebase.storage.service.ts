import { Inject, Injectable } from "@nestjs/common";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

@Injectable()
export class FirebaseStorageService {
  constructor(
    @Inject("FirebaseStorage")
    private readonly storage: ReturnType<typeof getStorage>,
  ) {}

  async uploadFile(file: Express.Multer.File, taskId: number): Promise<string> {
    const timeStamp = Date.now();
    const storageRef = ref(
      this.storage,
      `tasks/${taskId}/${timeStamp}_${file.originalname}`,
    );

    await uploadBytes(storageRef, file.buffer);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }
}
