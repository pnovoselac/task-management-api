import { Migration } from '@mikro-orm/migrations';

export class Migration20250319134500 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" alter column "attachment_file_urls" type text using ("attachment_file_urls"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" alter column "attachment_file_urls" type jsonb using ("attachment_file_urls"::jsonb);`);
  }

}
