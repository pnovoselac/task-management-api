import { Migration } from "@mikro-orm/migrations";

export class Migration20250316192024 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "project" drop constraint "project_member_id_foreign";`
    );

    this.addSql(
      `alter table "user" add column "member_projects_id" int not null;`
    );
    this.addSql(
      `alter table "user" add constraint "user_member_projects_id_foreign" foreign key ("member_projects_id") references "project" ("id") on update cascade;`
    );

    this.addSql(`alter table "project" drop column "member_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" drop constraint "user_member_projects_id_foreign";`
    );

    this.addSql(`alter table "user" drop column "member_projects_id";`);

    this.addSql(
      `alter table "project" add column "member_id" varchar(255) not null;`
    );
    this.addSql(
      `alter table "project" add constraint "project_member_id_foreign" foreign key ("member_id") references "user" ("id") on update cascade;`
    );
  }
}
