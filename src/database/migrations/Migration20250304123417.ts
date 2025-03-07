import { Migration } from '@mikro-orm/migrations';

export class Migration20250304123417 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "task" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) null, "status" varchar(255) not null default 'To Do', "priority" varchar(255) not null default 'Low', "due_date" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "project_id" int not null);`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`alter table "task" add constraint "task_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
  }

}
