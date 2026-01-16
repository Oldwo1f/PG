import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBrandLogosOptional1760000000002 implements MigrationInterface {
  name = 'MakeBrandLogosOptional1760000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Allow omitting logo fields at creation time by ensuring DB defaults exist.
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoUrl" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoIconUrl" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoLineUrl" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoLineUrl" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoIconUrl" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "logoUrl" DROP DEFAULT`,
    );
  }
}

