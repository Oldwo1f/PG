#!/bin/bash
# Script de diagnostic pour les images preview dans Docker

echo "🔍 Diagnostic des images preview dans Docker"
echo "=============================================="
echo ""

CONTAINER_NAME="perfectgenerations-backend"

# Vérifier si le container existe
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container ${CONTAINER_NAME} n'est pas en cours d'exécution"
    echo "   Vérifiez avec: docker ps"
    exit 1
fi

echo "✅ Container ${CONTAINER_NAME} trouvé"
echo ""

# 1. Vérifier les dossiers
echo "📁 Vérification des dossiers:"
echo "   /app/assets/templatePreviews:"
docker exec ${CONTAINER_NAME} ls -lah /app/assets/templatePreviews 2>/dev/null || echo "   ❌ N'existe pas"
echo ""
echo "   /app/dist/assets/templatePreviews:"
docker exec ${CONTAINER_NAME} ls -lah /app/dist/assets/templatePreviews 2>/dev/null || echo "   ❌ N'existe pas"
echo ""

# 2. Vérifier le chemin depuis dist/template
echo "🔍 Chemin simulé depuis dist/template (__dirname):"
docker exec ${CONTAINER_NAME} sh -c "cd /app/dist/template 2>/dev/null && pwd && ls -lah ../assets/templatePreviews 2>/dev/null || echo '   ❌ Chemin invalide'" || echo "   ❌ Impossible de vérifier"
echo ""

# 3. Chercher tous les fichiers PNG récents
echo "📄 Fichiers PNG récents dans /app:"
docker exec ${CONTAINER_NAME} find /app -name "*.png" -type f -mtime -1 2>/dev/null | head -10 || echo "   Aucun fichier PNG récent trouvé"
echo ""

# 4. Vérifier les permissions
echo "🔐 Permissions:"
docker exec ${CONTAINER_NAME} ls -lah /app/assets/ 2>/dev/null | head -5
echo ""

# 5. Vérifier les volumes Docker
echo "💾 Volumes Docker montés:"
docker inspect ${CONTAINER_NAME} --format '{{range .Mounts}}{{.Type}} {{.Destination}} {{.Source}}{{println}}{{end}}' | grep -E "(backend_assets|backend_uploads)"
echo ""

# 6. Vérifier les logs récents pour les erreurs de preview
echo "📋 Logs récents (preview/404):"
docker logs --tail 50 ${CONTAINER_NAME} 2>&1 | grep -i "preview\|404\|not found" | tail -10 || echo "   Aucun log pertinent trouvé"
echo ""

echo "=============================================="
echo "✅ Diagnostic terminé"
echo ""
echo "💡 Si les fichiers sont dans /app/dist/assets mais pas dans /app/assets,"
echo "   c'est que le volume Docker ne monte pas le bon dossier !"
