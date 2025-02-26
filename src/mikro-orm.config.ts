import { Options } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
  dbName: 'task_management',
  user: 'postgres',
  password: 'admin123',
  host: 'localhost',
  port: 5432,
  entities: ['./dist/entities/**/*.entity.js'],
  entitiesTs: ['./src/entities/**/*.entity.ts'],
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
