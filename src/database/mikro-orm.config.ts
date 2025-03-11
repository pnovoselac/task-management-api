import { defineConfig } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  migrations: {
    path: "./src/database/migrations",
    pathTs: "./src/database/migrations",
  },
  debug: true,
});
