#!/bin/bash

# Script pour exécuter les migrations TypeORM
# Détecte automatiquement si on est en production ou en développement

set -e

MIGRATION_COMMAND=${1:-run}  # run, revert, etc.

echo "🔍 Vérification de l'environnement..."
echo "   NODE_ENV: ${NODE_ENV:-non défini}"
echo "   dist/main.js existe: $([ -f "dist/main.js" ] && echo "oui" || echo "non")"
echo "   PWD: $(pwd)"

if [ "$NODE_ENV" = "production" ] || [ -f "dist/main.js" ]; then
  # Production: utiliser les fichiers compilés
  echo "🔧 Mode production: utilisation des fichiers compilés"
  
  # Vérifier que le fichier de config existe
  if [ ! -f "dist/config/typeorm.config.js" ]; then
    echo "❌ Erreur: dist/config/typeorm.config.js n'existe pas"
    echo "📋 Contenu de dist/config/:"
    ls -la dist/config/ 2>&1 || echo "Le dossier dist/config/ n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier de configuration trouvé: dist/config/typeorm.config.js"
  node ./node_modules/typeorm/cli.js migration:${MIGRATION_COMMAND} -d dist/config/typeorm.config.js
else
  # Développement: utiliser ts-node
  echo "🔧 Mode développement: utilisation de ts-node"
  
  # Vérifier que le fichier de config existe
  if [ ! -f "src/config/typeorm.config.ts" ]; then
    echo "❌ Erreur: src/config/typeorm.config.ts n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier de configuration trouvé: src/config/typeorm.config.ts"
  ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:${MIGRATION_COMMAND} -d src/config/typeorm.config.ts
fi

