import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: './src/database/migrations',
    pathTs: './src/database/migrations',
  },
});

