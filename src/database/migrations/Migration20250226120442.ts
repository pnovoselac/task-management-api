import { Migration } from '@mikro-orm/migrations';

export class Migration20250226120442 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "full_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text not null default '');`);
  }

}
