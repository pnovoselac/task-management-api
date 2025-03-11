import { Module, Global, Inject } from "@nestjs/common";
import { FirebaseAdminModule } from "./firebase.admin.module";
import { FirebaseStorageModule } from "./firebase.storage.module";

@Global()
@Module({
  imports: [FirebaseAdminModule, FirebaseStorageModule],
  exports: [FirebaseAdminModule, FirebaseStorageModule],
})
export class FirebaseModule {}
