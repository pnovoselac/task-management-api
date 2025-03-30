import { Migration } from "@mikro-orm/migrations";

export class Migration20250330195521 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" add column "created_at" timestamptz not null, add column "updated_at" timestamptz null, add column "deleted_at" timestamptz null;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user" drop column "created_at", drop column "updated_at", drop column "deleted_at";`
    );
  }
}
