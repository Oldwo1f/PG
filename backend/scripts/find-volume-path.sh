#!/bin/bash
# Script pour trouver où sont réellement stockés les volumes Docker sur le serveur hôte

echo "🔍 Recherche des chemins des volumes Docker"
echo "=============================================="
echo ""

CONTAINER_NAME="perfectgenerations-backend"

# Vérifier si le container existe
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container ${CONTAINER_NAME} n'est pas en cours d'exécution"
    exit 1
fi

echo "📦 Container: ${CONTAINER_NAME}"
echo ""

# Vérifier les volumes montés dans le container
echo "💾 Volumes montés dans le container:"
docker inspect ${CONTAINER_NAME} --format '{{range .Mounts}}{{.Type}} | {{.Destination}} | {{.Source}}{{println}}{{end}}' | grep -E "(backend_assets|backend_uploads)"
echo ""

# Chercher le volume backend_assets
echo "🔍 Recherche du volume backend_assets:"
VOLUME_NAME=$(docker inspect ${CONTAINER_NAME} --format '{{range .Mounts}}{{if eq .Destination "/app/assets"}}{{.Name}}{{end}}{{end}}')

if [ -n "$VOLUME_NAME" ]; then
    echo "✅ Nom du volume: $VOLUME_NAME"
    echo ""
    
    # Obtenir le chemin du volume sur le serveur hôte
    VOLUME_PATH=$(docker volume inspect $VOLUME_NAME --format '{{ .Mountpoint }}' 2>/dev/null)
    
    if [ -n "$VOLUME_PATH" ]; then
        echo "📁 Chemin sur le serveur hôte: $VOLUME_PATH"
        echo ""
        
        # Vérifier si le dossier templatePreviews existe
        if [ -d "$VOLUME_PATH/templatePreviews" ]; then
            echo "✅ Dossier templatePreviews trouvé sur le serveur hôte"
            echo "📄 Fichiers dans le volume:"
            ls -lah "$VOLUME_PATH/templatePreviews/" 2>/dev/null | head -10
        else
            echo "❌ Dossier templatePreviews n'existe pas encore dans le volume"
            echo "   Il sera créé automatiquement lors de la première génération de preview"
        fi
    else
        echo "⚠️  Impossible de trouver le chemin du volume"
    fi
else
    echo "❌ Volume backend_assets non trouvé"
fi

echo ""
echo "=============================================="
echo ""
echo "💡 Explication:"
echo "   - Dans le container Docker: /app/assets/templatePreviews"
echo "   - Sur le serveur hôte: $VOLUME_PATH/templatePreviews"
echo "   - Les deux pointent vers le même espace de stockage (volume Docker)"
