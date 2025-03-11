import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as firebaseAdmin from "firebase-admin";
import firebaseConfig from "./firebase.config";

@Global()
@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  providers: [
    {
      provide: "FirebaseAdmin",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serviceAccount = {
          projectId: configService.get("firebase.project_id"),
          privateKey: configService.get("firebase.private_key"),
          clientEmail: configService.get("firebase.client_email"),
        };

        if (!firebaseAdmin.apps.length) {
          firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(serviceAccount),
          });
        }
        return firebaseAdmin;
      },
    },
  ],
  exports: ["FirebaseAdmin"],
})
export class FirebaseAdminModule {}
