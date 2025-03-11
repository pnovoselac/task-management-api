import { Migration } from "@mikro-orm/migrations";

export class Migration20250307130006 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "task" add column "owner_id" varchar(255) not null;`,
    );
    this.addSql(
      `alter table "task" add constraint "task_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_owner_id_foreign";`);

    this.addSql(`alter table "task" drop column "owner_id";`);
  }
}
