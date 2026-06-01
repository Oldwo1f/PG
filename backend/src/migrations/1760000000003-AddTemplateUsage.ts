import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateUsage1760000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('templates');
    if (tableExists) {
      const columnExists = await queryRunner.hasColumn('templates', 'usage');
      if (!columnExists) {
        await queryRunner.query(
          `ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "usage" jsonb`,
        );
      } else {
        console.log('⚠️  Colonne "usage" existe déjà, migration ignorée');
      }
    } else {
      console.log('⚠️  Table "templates" n\'existe pas encore, migration ignorée');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('templates');
    if (tableExists) {
      const columnExists = await queryRunner.hasColumn('templates', 'usage');
      if (columnExists) {
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN IF EXISTS "usage"`);
      }
    }
  }
}
