import { Migration } from "@mikro-orm/migrations";

export class Migration20250324015530 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "task" alter column "status" type text using ("status"::text);`
    );
    this.addSql(
      `alter table "task" alter column "priority" type text using ("priority"::text);`
    );
    this.addSql(
      `alter table "task" add constraint "task_status_check" check("status" in ('To Do', 'In Progress', 'Completed'));`
    );
    this.addSql(
      `alter table "task" add constraint "task_priority_check" check("priority" in ('Low', 'Medium', 'High'));`
    );
    this.addSql(
      `create table "file" ("id" serial primary key, "url" varchar(255) not null, "created_at" timestamptz not null, "task_id" int not null);`
    );

    this.addSql(
      `alter table "file" add constraint "file_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "task" drop constraint if exists "task_status_check";`
    );
    this.addSql(
      `alter table "task" drop constraint if exists "task_priority_check";`
    );

    this.addSql(
      `alter table "task" alter column "status" type varchar(255) using ("status"::varchar(255));`
    );
    this.addSql(
      `alter table "task" alter column "priority" type varchar(255) using ("priority"::varchar(255));`
    );
  }
}
