#!/usr/bin/env ts-node
/**
 * Script pour vérifier où le serveur cherche réellement les fichiers de preview
 * et comparer avec où ils sont créés
 */

import * as fs from 'fs';
import * as path from 'path';

async function checkPreviewRoutes() {
  console.log('🔍 Vérification des chemins de preview\n');
  console.log('='.repeat(80));

  const projectRoot = path.resolve(__dirname, '..');
  
  // Simuler __dirname depuis le controller compilé
  const compiledControllerPath = path.join(projectRoot, 'dist', 'template', 'template.controller.js');
  const compiledServicePath = path.join(projectRoot, 'dist', 'template', 'template-preview.service.js');
  
  console.log('\n📁 Chemins simulés depuis le code compilé:');
  
  // Chemin utilisé par le controller pour SERVIR les images
  if (fs.existsSync(compiledControllerPath)) {
    const controllerDirname = path.dirname(compiledControllerPath);
    const controllerPreviewPath = path.resolve(controllerDirname, '../assets/templatePreviews');
    console.log(`\nController (SERVE):`);
    console.log(`  __dirname: ${controllerDirname}`);
    console.log(`  Chemin preview: ${controllerPreviewPath}`);
    console.log(`  Existe: ${fs.existsSync(controllerPreviewPath) ? '✅ OUI' : '❌ NON'}`);
    if (fs.existsSync(controllerPreviewPath)) {
      const files = fs.readdirSync(controllerPreviewPath);
      console.log(`  Fichiers: ${files.length}`);
      if (files.length > 0) {
        console.log(`  Exemples: ${files.slice(0, 5).join(', ')}`);
      }
    }
  }
  
  // Chemin utilisé par le service pour CRÉER les images
  if (fs.existsSync(compiledServicePath)) {
    const serviceDirname = path.dirname(compiledServicePath);
    const servicePreviewPath = path.resolve(serviceDirname, '../assets/templatePreviews');
    console.log(`\nService (CREATE):`);
    console.log(`  __dirname: ${serviceDirname}`);
    console.log(`  Chemin preview: ${servicePreviewPath}`);
    console.log(`  Existe: ${fs.existsSync(servicePreviewPath) ? '✅ OUI' : '❌ NON'}`);
    if (fs.existsSync(servicePreviewPath)) {
      const files = fs.readdirSync(servicePreviewPath);
      console.log(`  Fichiers: ${files.length}`);
      if (files.length > 0) {
        console.log(`  Exemples: ${files.slice(0, 5).join(', ')}`);
      }
    }
  }

  // Vérifier tous les emplacements possibles
  console.log('\n\n🔍 Recherche dans TOUS les emplacements possibles:');
  const possiblePaths = [
    path.join(projectRoot, 'src', 'assets', 'templatePreviews'),
    path.join(projectRoot, 'dist', 'assets', 'templatePreviews'),
    path.join(projectRoot, 'dist', 'src', 'assets', 'templatePreviews'),
    path.join(projectRoot, 'assets', 'templatePreviews'),
    path.join(projectRoot, 'uploads', 'templatePreviews'),
    path.join(projectRoot, 'uploads', 'images'),
    path.join(projectRoot, 'public', 'templatePreviews'),
    path.join(projectRoot, 'static', 'templatePreviews'),
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      const files = fs.readdirSync(testPath).filter(f => f.endsWith('.png'));
      console.log(`\n✅ ${testPath}`);
      console.log(`   Fichiers PNG: ${files.length}`);
      if (files.length > 0) {
        const stats = fs.statSync(path.join(testPath, files[0]));
        console.log(`   Exemple: ${files[0]} (${(stats.size / 1024).toFixed(2)} KB, modifié: ${stats.mtime.toISOString()})`);
      }
    }
  }

  // Recherche récursive de tous les fichiers PNG qui pourraient être des previews
  console.log('\n\n🔍 Recherche récursive de fichiers PNG récents:');
  const searchDirs = [
    path.join(projectRoot, 'dist'),
    path.join(projectRoot, 'uploads'),
    path.join(projectRoot, 'assets'),
  ];

  const foundPngs: Array<{ path: string; name: string; size: number; mtime: Date }> = [];

  function searchPngs(dir: string, maxDepth: number = 3) {
    if (maxDepth === 0 || !fs.existsSync(dir)) return;
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.includes('node_modules')) {
          searchPngs(fullPath, maxDepth - 1);
        } else if (entry.isFile() && entry.name.endsWith('.png')) {
          const stats = fs.statSync(fullPath);
          // Seulement les fichiers récents (créés dans les 7 derniers jours)
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceModified <= 7) {
            foundPngs.push({
              path: fullPath,
              name: entry.name,
              size: stats.size,
              mtime: stats.mtime,
            });
          }
        }
      }
    } catch (error) {
      // Ignorer les erreurs de permission
    }
  }

  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      searchPngs(dir);
    }
  }

  if (foundPngs.length > 0) {
    console.log(`\nTrouvé ${foundPngs.length} fichier(s) PNG récent(s):`);
    foundPngs.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    for (const png of foundPngs.slice(0, 20)) {
      console.log(`  ${png.name}`);
      console.log(`    Chemin: ${png.path}`);
      console.log(`    Taille: ${(png.size / 1024).toFixed(2)} KB`);
      console.log(`    Modifié: ${png.mtime.toISOString()}`);
      console.log('');
    }
  } else {
    console.log('\n❌ Aucun fichier PNG récent trouvé');
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 ANALYSE:');
  console.log('Si les chemins CREATE et SERVE sont différents, c\'est le problème !');
  console.log('Les fichiers sont créés dans un endroit mais servis depuis un autre.');
}

checkPreviewRoutes().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
