#!/bin/bash
# Script pour migrer les fichiers de preview de dist/assets vers assets

CONTAINER_NAME="perfectgenerations-backend"

echo "🔄 Migration des fichiers de preview"
echo "======================================"
echo ""

# Vérifier si le container existe
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container ${CONTAINER_NAME} n'est pas en cours d'exécution"
    exit 1
fi

echo "✅ Container ${CONTAINER_NAME} trouvé"
echo ""

# Créer le dossier de destination
echo "📁 Création du dossier de destination..."
docker exec ${CONTAINER_NAME} mkdir -p /app/assets/templatePreviews

# Compter les fichiers à migrer
FILE_COUNT=$(docker exec ${CONTAINER_NAME} sh -c "ls -1 /app/dist/assets/templatePreviews/*.png 2>/dev/null | wc -l" | tr -d ' ')

if [ "$FILE_COUNT" -eq "0" ]; then
    echo "ℹ️  Aucun fichier à migrer"
    exit 0
fi

echo "📄 Fichiers trouvés à migrer: $FILE_COUNT"
echo ""

# Lister les fichiers
echo "📋 Liste des fichiers:"
docker exec ${CONTAINER_NAME} ls -lh /app/dist/assets/templatePreviews/*.png 2>/dev/null
echo ""

# Migrer les fichiers
echo "🔄 Migration en cours..."
docker exec ${CONTAINER_NAME} sh -c "mv /app/dist/assets/templatePreviews/*.png /app/assets/templatePreviews/ 2>&1"

if [ $? -eq 0 ]; then
    echo "✅ Migration réussie"
    echo ""
    
    # Vérifier les fichiers dans le nouveau dossier
    echo "📁 Fichiers dans /app/assets/templatePreviews:"
    docker exec ${CONTAINER_NAME} ls -lh /app/assets/templatePreviews/
    echo ""
    
    # Vérifier que l'ancien dossier est vide
    REMAINING=$(docker exec ${CONTAINER_NAME} sh -c "ls -1 /app/dist/assets/templatePreviews/*.png 2>/dev/null | wc -l" | tr -d ' ')
    if [ "$REMAINING" -eq "0" ]; then
        echo "✅ Ancien dossier vidé avec succès"
    else
        echo "⚠️  Il reste $REMAINING fichier(s) dans l'ancien dossier"
    fi
else
    echo "❌ Erreur lors de la migration"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ Migration terminée"
echo ""
echo "💡 Les fichiers sont maintenant dans /app/assets/templatePreviews"
echo "   qui est monté dans le volume Docker backend_assets"
