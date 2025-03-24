import { Migration } from '@mikro-orm/migrations';

export class Migration20250319085359 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project_members" ("project_id" int not null, "user_id" varchar(255) not null, constraint "project_members_pkey" primary key ("project_id", "user_id"));`);

    this.addSql(`alter table "project_members" add constraint "project_members_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "project_members" add constraint "project_members_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "project_members" cascade;`);
  }

}
