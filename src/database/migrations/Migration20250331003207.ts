import { Migration } from '@mikro-orm/migrations';

export class Migration20250331003207 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" add column "deleted_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop column "deleted_at";`);
  }

}
