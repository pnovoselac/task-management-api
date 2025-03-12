import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { FirebaseStorageService } from "./firebase.storage.service";
import firebaseConfig from "./firebase.config";

@Global()
@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  providers: [
    {
      provide: "FirebaseStorage",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const clientApp = initializeApp({
          storageBucket: configService.get("firebase.storage_bucket"),
        });
        return getStorage(clientApp);
      },
    },
    FirebaseStorageService,
  ],
  exports: ["FirebaseStorage", FirebaseStorageService],
})
export class FirebaseStorageModule {}
