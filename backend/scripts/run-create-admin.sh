#!/bin/sh

# Script pour créer l'admin en production ou développement
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
  if [ ! -f "dist/tools/create-admin-user.js" ]; then
    echo "❌ Erreur: dist/tools/create-admin-user.js n'existe pas"
    echo "📋 Contenu de dist/tools/:"
    ls -la dist/tools/ 2>&1 || echo "Le dossier dist/tools/ n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier trouvé: dist/tools/create-admin-user.js"
  node dist/tools/create-admin-user.js
else
  # Développement: utiliser ts-node
  echo "🔧 Mode développement: utilisation de ts-node"
  
  if [ ! -f "tools/create-admin-user.ts" ]; then
    echo "❌ Erreur: tools/create-admin-user.ts n'existe pas"
    exit 1
  fi
  
  echo "✅ Fichier trouvé: tools/create-admin-user.ts"
  ts-node -r tsconfig-paths/register tools/create-admin-user.ts
fi

