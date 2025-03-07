import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import databaseConfig from './database.config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        user: configService.get('database.user'),
        password: configService.get('database.password'),
        dbName: configService.get('database.dbName'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        migrations: {
          path: './src/database/migrations',
          pathTs: './dist/database/migrations',
        },
        debug: true,
        useMikroORMConfigLoader: false,
      }),
    }),
    
  ],
  providers:[MikroOrmModule],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
