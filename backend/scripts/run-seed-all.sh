#!/bin/sh

# Script pour exécuter seed-all en production ou développement
# Détecte automatiquement l'environnement

set -e

echo "🔍 Vérification de l'environnement..."
echo "   NODE_ENV: ${NODE_ENV:-non défini}"
echo "   dist/main.js existe: $([ -f "dist/main.js" ] && echo "oui" || echo "non")"
echo "   PWD: $(pwd)"

# Toujours utiliser ts-node car les fichiers tools ne sont pas compilés dans dist/
# ts-node est installé en production pour permettre l'exécution des scripts tools

if [ ! -f "tools/seed-all.ts" ]; then
  echo "❌ Erreur: tools/seed-all.ts n'existe pas"
  echo "📋 Contenu du dossier tools/:"
  ls -la tools/ 2>&1 || echo "Le dossier tools/ n'existe pas"
  exit 1
fi

echo "✅ Fichier de seed trouvé: tools/seed-all.ts"
echo "🔧 Utilisation de ts-node pour exécuter le script..."

# Vérifier que ts-node est disponible
if ! command -v ts-node >/dev/null 2>&1 && [ ! -f "node_modules/.bin/ts-node" ]; then
  echo "❌ ts-node n'est pas disponible"
  echo "💡 Installation de ts-node..."
  npm install --save-dev ts-node tsconfig-paths typescript
fi

# Vérifier que tsconfig.json existe
if [ ! -f "tsconfig.json" ]; then
  echo "❌ Erreur: tsconfig.json n'existe pas"
  echo "📋 Contenu du répertoire:"
  ls -la | head -20
  exit 1
fi

echo "✅ tsconfig.json trouvé"

# Utiliser le ts-node local ou global avec le tsconfig.json explicite
if [ -f "node_modules/.bin/ts-node" ]; then
  npx ts-node -P tsconfig.json -r tsconfig-paths/register tools/seed-all.ts
else
  ts-node -P tsconfig.json -r tsconfig-paths/register tools/seed-all.ts
fi

