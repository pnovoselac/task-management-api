import { Migration } from '@mikro-orm/migrations';

export class Migration20250226145314 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "task" alter column "priority" type varchar(255) using ("priority"::varchar(255));`);
    this.addSql(`alter table "task" alter column "priority" drop not null;`);
    this.addSql(`alter table "task" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "task" alter column "updated_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "task" alter column "priority" type varchar(255) using ("priority"::varchar(255));`);
    this.addSql(`alter table "task" alter column "priority" set not null;`);
    this.addSql(`alter table "task" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "task" alter column "updated_at" set not null;`);
  }

}
