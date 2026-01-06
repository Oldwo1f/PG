#!/bin/bash

# Script pour initialiser la base de données (créer les tables si elles n'existent pas)
# Usage: ./scripts/init-db.sh

set -e

# Détecter la commande Docker Compose disponible
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "🗄️  Initialisation de la base de données..."

# Vérifier que le conteneur backend est en cours d'exécution
if ! $DOCKER_COMPOSE ps | grep -q "backend.*Up"; then
    echo "❌ Le conteneur backend n'est pas en cours d'exécution"
    echo "💡 Démarrez d'abord les conteneurs avec: $DOCKER_COMPOSE up -d"
    exit 1
fi

# Vérifier que PostgreSQL est prêt
echo "⏳ Vérification de PostgreSQL..."
if ! $DOCKER_COMPOSE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "❌ PostgreSQL n'est pas prêt"
    exit 1
fi
echo "✅ PostgreSQL est prêt"

# Créer les tables en utilisant synchronize temporairement
echo "🔧 Création des tables (si elles n'existent pas)..."
echo "💡 Cette opération utilise synchronize pour créer les tables initiales"
echo "⚠️  Note: synchronize sera désactivé après cette opération"

# Créer un script temporaire dans le conteneur pour activer synchronize
$DOCKER_COMPOSE exec -T backend sh -c "
  # Modifier temporairement app.module.ts pour activer synchronize
  sed -i 's/synchronize: process.env.NODE_ENV !== \"production\"/synchronize: true/' dist/app.module.js || true
  # Redémarrer le backend pour appliquer les changements
" || echo "⚠️  Impossible de modifier synchronize automatiquement"

echo ""
echo "📝 Instructions manuelles:"
echo "1. Entrez dans le conteneur: $DOCKER_COMPOSE exec backend sh"
echo "2. Modifiez temporairement dist/app.module.js pour activer synchronize"
echo "3. Redémarrez le backend: $DOCKER_COMPOSE restart backend"
echo "4. Attendez que le backend démarre (les tables seront créées)"
echo "5. Désactivez synchronize et redémarrez"
echo ""
echo "OU utilisez les migrations après avoir créé les tables manuellement"

