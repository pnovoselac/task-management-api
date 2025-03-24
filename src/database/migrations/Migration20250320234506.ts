import { Migration } from '@mikro-orm/migrations';

export class Migration20250320234506 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" drop column "attachment_file_urls";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" add column "attachment_file_urls" text null;`);
  }

}
