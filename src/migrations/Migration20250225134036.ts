import { Migration } from '@mikro-orm/migrations';

export class Migration20250225134036 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "task" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) null, "status" varchar(255) not null default 'To Do', "priority" varchar(255) not null, "due_date" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "full_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text not null default '');`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "task" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
