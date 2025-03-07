import { Module, Global, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import firebaseConfig from './firebase.config';
import * as firebaseAdmin from 'firebase-admin';
import {getStorage} from 'firebase/storage';
import {initializeApp} from 'firebase/app'
import { FirebaseStorageService } from './firebase.storage.service';

@Global()
@Module({
    imports:[
        ConfigModule.forFeature(firebaseConfig),],
    providers:[{
        provide:'FirebaseAdmin', 
        inject:[ConfigService],
        useFactory: (configService: ConfigService) => {
            const serviceAccount = {
              projectId: configService.get('firebase.project_id'),
              privateKey: configService.get('firebase.private_key'),
              clientEmail: configService.get('firebase.client_email'),
            };
    
            if (!firebaseAdmin.apps.length) {
                firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
              });
            }
            return firebaseAdmin;
          },
    },
      {
        provide: 'FirebaseStorage',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const clientApp = initializeApp({
            storageBucket: configService.get('firebase.storage_bucket')
          });
          return getStorage(clientApp);
        },
      },
    FirebaseStorageService,
  ],
    exports:['FirebaseAdmin', 'FirebaseStorage', FirebaseStorageService]
})
export class FirebaseModule {}

