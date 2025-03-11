import { Migration } from "@mikro-orm/migrations";

export class Migration20250307113452 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "task" add column "attachment_file_url" varchar(255) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" drop column "attachment_file_url";`);
  }
}
