#!/usr/bin/env ts-node
/**
 * Script de diagnostic pour les images de preview de templates
 * 
 * Ce script vérifie:
 * 1. Où sont stockées les images (src/assets vs dist/assets)
 * 2. Quels fichiers existent réellement
 * 3. Quels fichiers sont référencés dans la base de données
 * 4. Les templates avec des images manquantes
 */

import * as fs from 'fs';
import * as path from 'path';
import { DataSource, Not, IsNull } from 'typeorm';
import { Template } from '../src/template/entities/template.entity';
import typeormConfig from '../src/config/typeorm.config';

async function diagnosePreviewImages() {
  console.log('🔍 Diagnostic des images de preview de templates\n');
  console.log('=' .repeat(80));

  // 1. Vérifier les chemins possibles
  const projectRoot = path.resolve(__dirname, '..');
  const srcAssetsPath = path.join(projectRoot, 'src', 'assets', 'templatePreviews');
  const distAssetsPath = path.join(projectRoot, 'dist', 'assets', 'templatePreviews');
  const distSrcAssetsPath = path.join(projectRoot, 'dist', 'src', 'assets', 'templatePreviews');

  console.log('\n📁 Chemins vérifiés:');
  console.log(`  1. ${srcAssetsPath}`);
  console.log(`  2. ${distAssetsPath}`);
  console.log(`  3. ${distSrcAssetsPath}`);

  // 2. Vérifier quels dossiers existent
  const existingPaths: string[] = [];
  if (fs.existsSync(srcAssetsPath)) {
    existingPaths.push(srcAssetsPath);
    console.log(`\n✅ Dossier trouvé: ${srcAssetsPath}`);
  }
  if (fs.existsSync(distAssetsPath)) {
    existingPaths.push(distAssetsPath);
    console.log(`✅ Dossier trouvé: ${distAssetsPath}`);
  }
  if (fs.existsSync(distSrcAssetsPath)) {
    existingPaths.push(distSrcAssetsPath);
    console.log(`✅ Dossier trouvé: ${distSrcAssetsPath}`);
  }

  if (existingPaths.length === 0) {
    console.log('\n❌ Aucun dossier templatePreviews trouvé!');
    console.log('   Les images sont peut-être dans un autre emplacement.');
  }

  // 3. Lister les fichiers dans chaque dossier existant
  const allFiles: Map<string, { path: string; size: number; mtime: Date }> = new Map();
  
  for (const dirPath of existingPaths) {
    try {
      const files = fs.readdirSync(dirPath);
      console.log(`\n📄 Fichiers dans ${dirPath}:`);
      console.log(`   Total: ${files.length} fichier(s)`);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        allFiles.set(file, {
          path: filePath,
          size: stats.size,
          mtime: stats.mtime,
        });
        console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB, modifié: ${stats.mtime.toISOString()})`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur lors de la lecture: ${error.message}`);
    }
  }

  // 4. Se connecter à la base de données et récupérer les templates
  console.log('\n\n🗄️  Analyse de la base de données...');
  const dataSource = new DataSource(typeormConfig);
  
  try {
    await dataSource.initialize();
    console.log('✅ Connexion à la base de données réussie');

    const templateRepository = dataSource.getRepository(Template);
    const templates = await templateRepository.find({
      where: {
        previewImage: Not(IsNull()),
      },
      order: { createdAt: 'DESC' },
    });

    // Filtrer les templates avec previewImage non null
    const templatesWithPreview = templates.filter(t => t.previewImage);

    console.log(`\n📊 Templates avec previewImage dans la DB: ${templatesWithPreview.length}`);

    // 5. Comparer les fichiers DB vs fichiers système
    const missingFiles: Array<{ template: Template; filename: string }> = [];
    const foundFiles: Array<{ template: Template; filename: string; path: string }> = [];

    console.log('\n🔍 Vérification des fichiers...\n');
    
    for (const template of templatesWithPreview) {
      const filename = template.previewImage;
      if (!filename) continue;

      const fileExists = allFiles.has(filename);
      
      if (fileExists) {
        const fileInfo = allFiles.get(filename)!;
        foundFiles.push({ template, filename, path: fileInfo.path });
        console.log(`✅ ${filename} - Trouvé (Template: "${template.name}", créé: ${template.createdAt?.toISOString()})`);
      } else {
        missingFiles.push({ template, filename });
        console.log(`❌ ${filename} - MANQUANT (Template: "${template.name}", créé: ${template.createdAt?.toISOString()})`);
      }
    }

    // 6. Résumé
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 RÉSUMÉ:');
    console.log(`   Total templates avec previewImage: ${templatesWithPreview.length}`);
    console.log(`   Fichiers trouvés: ${foundFiles.length}`);
    console.log(`   Fichiers manquants: ${missingFiles.length}`);
    console.log(`   Fichiers sur disque (non référencés): ${allFiles.size - foundFiles.length}`);

    if (missingFiles.length > 0) {
      console.log('\n⚠️  TEMPLATES AVEC IMAGES MANQUANTES:');
      for (const { template, filename } of missingFiles) {
        console.log(`   - "${template.name}" (ID: ${template.id})`);
        console.log(`     Fichier: ${filename}`);
        console.log(`     Créé le: ${template.createdAt?.toISOString()}`);
        console.log('');
      }
    }

    // 7. Vérifier le chemin utilisé par le serveur
    console.log('\n🔧 CHEMIN UTILISÉ PAR LE SERVEUR:');
    // Simuler __dirname du controller compilé
    const compiledControllerPath = path.join(projectRoot, 'dist', 'template', 'template.controller.js');
    if (fs.existsSync(compiledControllerPath)) {
      const simulatedDirname = path.dirname(compiledControllerPath);
      const serverPreviewPath = path.join(simulatedDirname, '../assets/templatePreviews');
      const resolvedServerPath = path.resolve(serverPreviewPath);
      console.log(`   Chemin simulé (depuis dist/template/): ${resolvedServerPath}`);
      console.log(`   Existe: ${fs.existsSync(resolvedServerPath) ? '✅ OUI' : '❌ NON'}`);
      
      if (fs.existsSync(resolvedServerPath)) {
        const serverFiles = fs.readdirSync(resolvedServerPath);
        console.log(`   Fichiers dans ce dossier: ${serverFiles.length}`);
      }
    } else {
      console.log('   ⚠️  Fichier compilé non trouvé, impossible de simuler le chemin');
    }

    // 8. Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    if (missingFiles.length > 0) {
      console.log('   1. Les fichiers manquants doivent être régénérés');
      console.log('   2. Vérifiez si un script de nettoyage a supprimé les fichiers');
      console.log('   3. Vérifiez les logs du serveur pour voir où les fichiers sont créés');
      console.log('   4. Assurez-vous que le dossier templatePreviews est persistant (pas dans /tmp)');
    }
    
    if (allFiles.size > foundFiles.length) {
      console.log('   5. Il y a des fichiers orphelins sur le disque (non référencés en DB)');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la connexion à la base de données:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Diagnostic terminé\n');
}

// Exécuter le script
diagnosePreviewImages().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
