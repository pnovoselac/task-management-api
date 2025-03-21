import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "FirebaseStorage",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: configService.get("firebase.project_id"),
              privateKey: configService
                .get("firebase.private_key")
                ?.replace(/\\n/g, "\n"),
              clientEmail: configService.get("firebase.client_email"),
            }),
            storageBucket: configService.get("firebase.storage_bucket"),
          });
        }
        const bucket = admin.storage().bucket();
        return bucket;
      },
    },
  ],
  exports: ["FirebaseStorage"],
})
export class FirebaseStorageModule {}
