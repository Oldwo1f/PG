#!/bin/sh

# Script pour exécuter les seeds en production ou développement
# Détecte automatiquement l'environnement

set -e

echo "🔍 Vérification de l'environnement..."
echo "   NODE_ENV: ${NODE_ENV:-non défini}"
echo "   dist/main.js existe: $([ -f "dist/main.js" ] && echo "oui" || echo "non")"
echo "   PWD: $(pwd)"

if [ "$NODE_ENV" = "production" ] || [ -f "dist/main.js" ]; then
  # Production: utiliser les fichiers compilés
  echo "🔧 Mode production: utilisation des fichiers compilés"
  
  # Vérifier que les fichiers compilés existent
  if [ ! -f "dist/seeds/seeder.js" ]; then
    echo "❌ Erreur: dist/seeds/seeder.js n'existe pas"
    echo "📋 Contenu de dist/seeds/:"
    ls -la dist/seeds/ 2>&1 || echo "Le dossier dist/seeds/ n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier de seed trouvé: dist/seeds/seeder.js"
  node dist/seeds/seeder.js
else
  # Développement: utiliser ts-node
  echo "🔧 Mode développement: utilisation de ts-node"
  
  if [ ! -f "src/seeds/seeder.ts" ]; then
    echo "❌ Erreur: src/seeds/seeder.ts n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier de seed trouvé: src/seeds/seeder.ts"
  ts-node -r tsconfig-paths/register src/seeds/seeder.ts
fi

