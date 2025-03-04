import { Migration } from '@mikro-orm/migrations';

export class Migration20250228122522_NewMigration extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user" ("id" serial primary key);`);

    this.addSql(`alter table "task" add column "project_id" int not null;`);
    this.addSql(`alter table "task" add constraint "task_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_project_id_foreign";`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`alter table "task" drop column "project_id";`);
  }

}
