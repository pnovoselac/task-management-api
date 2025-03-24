import { Migration } from "@mikro-orm/migrations";

export class Migration20250319111132 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "task" rename column "attachment_file_url" to "attachment_file_urls";`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "task" rename column "attachment_file_urls" to "attachment_file_url";`
    );
  }
}
