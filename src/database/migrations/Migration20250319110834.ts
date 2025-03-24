import { Migration } from "@mikro-orm/migrations";

export class Migration20250319110834 extends Migration {
  override async up(): Promise<void> {
    this.addSql('update "task" set "attachment_file_url" = NULL;');
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "task" alter column "attachment_file_url" type varchar(255) using ("attachment_file_url"::varchar(255));`
    );
  }
}
