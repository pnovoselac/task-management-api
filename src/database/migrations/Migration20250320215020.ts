import { Migration } from '@mikro-orm/migrations';

export class Migration20250320215020 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "file" ("id" serial primary key, "url" varchar(255) not null, "created_at" timestamptz not null, "task_id" int not null);`);

    this.addSql(`alter table "file" add constraint "file_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "file" cascade;`);
  }

}
