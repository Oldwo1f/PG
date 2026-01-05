import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApiKeyColumns1752000000000 implements MigrationInterface {
  name = 'AddApiKeyColumns1752000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "apiKey" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isApiOnly" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isApiOnly"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "apiKey"`);
  }
}
