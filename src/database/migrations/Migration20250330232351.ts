import { Migration } from '@mikro-orm/migrations';

export class Migration20250330232351 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "project" add column "deleted_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project" drop column "deleted_at";`);
  }

}
