import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './database.config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        user: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        dbName: configService.get<string>('database.dbName'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        migrations: {
          path: './src/database/migrations',
          pathTs: './src/database/migrations',
        },
        debug: true,
        driver: PostgreSqlDriver,
      }),
    }),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
