#!/bin/bash
# Script de diagnostic pour les images de preview de templates

cd "$(dirname "$0")/.." || exit 1

echo "🔍 Lancement du diagnostic des images de preview..."
echo ""

# Vérifier que ts-node est disponible
if ! command -v ts-node &> /dev/null; then
    echo "❌ ts-node n'est pas installé. Installation..."
    npm install -g ts-node
fi

# Exécuter le script de diagnostic
ts-node -r tsconfig-paths/register tools/diagnose-preview-images.ts
