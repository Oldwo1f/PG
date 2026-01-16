import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrandLogoVariants1760000000001 implements MigrationInterface {
  name = 'AddBrandLogoVariants1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ADD COLUMN IF NOT EXISTS "logoIconUrl" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD COLUMN IF NOT EXISTS "logoLineUrl" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN IF EXISTS "logoLineUrl"`);
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN IF EXISTS "logoIconUrl"`);
  }
}

