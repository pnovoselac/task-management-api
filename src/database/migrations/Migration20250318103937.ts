import { Migration } from '@mikro-orm/migrations';

export class Migration20250318103937 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_member_projects_id_foreign";`);

    this.addSql(`alter table "user" drop column "member_projects_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" add column "member_projects_id" int not null;`);
    this.addSql(`alter table "user" add constraint "user_member_projects_id_foreign" foreign key ("member_projects_id") references "project" ("id") on update cascade;`);
  }

}
