import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBrandExtraColors1760000000000 implements MigrationInterface {
  name = 'AddBrandExtraColors1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ADD COLUMN IF NOT EXISTS "accentColor" character varying NOT NULL DEFAULT '#000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD COLUMN IF NOT EXISTS "textColorDark" character varying NOT NULL DEFAULT '#000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD COLUMN IF NOT EXISTS "textColor2Dark" character varying NOT NULL DEFAULT '#000000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN IF EXISTS "textColor2Dark"`);
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN IF EXISTS "textColorDark"`);
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN IF EXISTS "accentColor"`);
  }
}

