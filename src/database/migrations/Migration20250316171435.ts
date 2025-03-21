import { Migration } from "@mikro-orm/migrations";

export class Migration20250316171435 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" drop constraint "user_project_id_foreign";`
    );

    this.addSql(`alter table "user" drop column "project_id";`);

    this.addSql(
      `alter table "project" add column "member_id" varchar(255) null;`
    );
    this.addSql(
      `alter table "project" add constraint "project_member_id_foreign" foreign key ("member_id") references "user" ("id") on update cascade;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "project" drop constraint "project_member_id_foreign";`
    );

    this.addSql(`alter table "user" add column "project_id" int null;`);
    this.addSql(
      `alter table "user" add constraint "user_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;`
    );

    this.addSql(`alter table "project" drop column "member_id";`);
  }
}
