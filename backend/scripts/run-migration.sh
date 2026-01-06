#!/bin/bash

# Script pour exécuter les migrations TypeORM
# Détecte automatiquement si on est en production ou en développement

set -e

MIGRATION_COMMAND=${1:-run}  # run, revert, etc.

if [ "$NODE_ENV" = "production" ] || [ -f "dist/main.js" ]; then
  # Production: utiliser les fichiers compilés
  echo "🔧 Mode production: utilisation des fichiers compilés"
  node ./node_modules/typeorm/cli.js migration:${MIGRATION_COMMAND} -d dist/config/typeorm.config.js
else
  # Développement: utiliser ts-node
  echo "🔧 Mode développement: utilisation de ts-node"
  ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:${MIGRATION_COMMAND} -d src/config/typeorm.config.ts
fi

