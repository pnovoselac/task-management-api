import { Migration } from "@mikro-orm/migrations";

export class Migration20250316154825 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "project_id" int;`);
    this.addSql(
      `alter table "user" add constraint "user_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;`
    );

    this.addSql(
      `alter table "project" add column "owner_id" varchar(255) not null;`
    );
    this.addSql(
      `alter table "project" add constraint "project_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "project" drop constraint "project_owner_id_foreign";`
    );

    this.addSql(
      `alter table "user" drop constraint "user_project_id_foreign";`
    );

    this.addSql(`alter table "project" drop column "owner_id";`);

    this.addSql(`alter table "user" drop column "project_id";`);
  }
}
