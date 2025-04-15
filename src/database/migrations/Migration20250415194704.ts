import { Migration } from "@mikro-orm/migrations";

export class Migration20250415194704 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `ALTER TABLE "task" DROP CONSTRAINT IF EXISTS "task_owner_id_foreign";`
    );
    this.addSql(
      `ALTER TABLE "project" DROP CONSTRAINT IF EXISTS "project_owner_id_foreign";`
    );
    this.addSql(
      `ALTER TABLE "project_members" DROP CONSTRAINT IF EXISTS "project_members_user_id_foreign";`
    );

    this.addSql(`ALTER TABLE "user" ADD COLUMN "firebase_id" VARCHAR(255);`);
    this.addSql(`UPDATE "user" SET "firebase_id" = "id";`);
    this.addSql(`ALTER TABLE "user" ADD COLUMN "new_id" UUID;`);
    this.addSql(`UPDATE "user" SET "new_id" = gen_random_uuid();`);
    this.addSql(`ALTER TABLE "user" DROP CONSTRAINT "user_pkey";`);
    this.addSql(`ALTER TABLE "user" ALTER COLUMN "new_id" SET NOT NULL;`);
    this.addSql(`ALTER TABLE "user" DROP COLUMN "id";`);
    this.addSql(`ALTER TABLE "user" RENAME COLUMN "new_id" TO "id";`);
    this.addSql(`ALTER TABLE "user" ADD PRIMARY KEY ("id");`);

    this.addSql(`ALTER TABLE "task" ADD COLUMN "new_owner_id" UUID;`);
    this.addSql(
      `UPDATE "task" t SET "new_owner_id" = u.id FROM "user" u WHERE t.owner_id = u.firebase_id;`
    );
    this.addSql(`ALTER TABLE "task" DROP COLUMN "owner_id";`);
    this.addSql(
      `ALTER TABLE "task" RENAME COLUMN "new_owner_id" TO "owner_id";`
    );
    this.addSql(`ALTER TABLE "task" ALTER COLUMN "owner_id" SET NOT NULL;`);

    this.addSql(`ALTER TABLE "project" ADD COLUMN "new_owner_id" UUID;`);
    this.addSql(
      `UPDATE "project" p SET "new_owner_id" = u.id FROM "user" u WHERE p.owner_id = u.firebase_id;`
    );
    this.addSql(`ALTER TABLE "project" DROP COLUMN "owner_id";`);
    this.addSql(
      `ALTER TABLE "project" RENAME COLUMN "new_owner_id" TO "owner_id";`
    );
    this.addSql(`ALTER TABLE "project" ALTER COLUMN "owner_id" SET NOT NULL;`);

    this.addSql(`ALTER TABLE "project_members" ADD COLUMN "new_user_id" UUID;`);
    this.addSql(
      `UPDATE "project_members" pm SET "new_user_id" = u.id FROM "user" u WHERE pm.user_id = u.firebase_id;`
    );
    this.addSql(`ALTER TABLE "project_members" DROP COLUMN "user_id";`);
    this.addSql(
      `ALTER TABLE "project_members" RENAME COLUMN "new_user_id" TO "user_id";`
    );
    this.addSql(
      `ALTER TABLE "project_members" ALTER COLUMN "user_id" SET NOT NULL;`
    );

    this.addSql(`
      ALTER TABLE "task" 
      ADD CONSTRAINT "task_owner_id_foreign" 
      FOREIGN KEY ("owner_id") REFERENCES "user" ("id");
    `);

    this.addSql(`
      ALTER TABLE "project" 
      ADD CONSTRAINT "project_owner_id_foreign" 
      FOREIGN KEY ("owner_id") REFERENCES "user" ("id");
    `);

    this.addSql(`
      ALTER TABLE "project_members" 
      ADD CONSTRAINT "project_members_user_id_foreign" 
      FOREIGN KEY ("user_id") REFERENCES "user" ("id");
    `);
  }

  async down(): Promise<void> {
    this.addSql(`ALTER TABLE "user" DROP CONSTRAINT "user_pkey";`);
    this.addSql(`ALTER TABLE "user" RENAME COLUMN "id" TO "temp_id";`);
    this.addSql(`ALTER TABLE "user" ADD COLUMN "id" VARCHAR(255);`);
    this.addSql(`UPDATE "user" SET "id" = "firebase_id";`);
    this.addSql(`ALTER TABLE "user" ALTER COLUMN "id" SET NOT NULL;`);
    this.addSql(`ALTER TABLE "user" ADD PRIMARY KEY ("id");`);
    this.addSql(`ALTER TABLE "user" DROP COLUMN "temp_id";`);
  }
}
