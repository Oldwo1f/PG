import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreviewImage1750702053707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la table existe avant de la modifier
    const tableExists = await queryRunner.hasTable('templates');
    if (tableExists) {
      // Vérifier si la colonne existe déjà
      const columnExists = await queryRunner.hasColumn('templates', 'previewImage');
      if (!columnExists) {
        await queryRunner.query(
          `ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "previewImage" character varying`,
        );
      } else {
        console.log('⚠️  Colonne "previewImage" existe déjà, migration ignorée');
      }
    } else {
      console.log('⚠️  Table "templates" n\'existe pas encore, migration ignorée');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('templates');
    if (tableExists) {
      const columnExists = await queryRunner.hasColumn('templates', 'previewImage');
      if (columnExists) {
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN IF EXISTS "previewImage"`);
      }
    }
  }
}
