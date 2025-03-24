import { Migration } from '@mikro-orm/migrations';

export class Migration20250319153856 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "project" add column "visibility" text check ("visibility" in ('public', 'private')) not null default 'private';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project" drop column "visibility";`);
  }

}
