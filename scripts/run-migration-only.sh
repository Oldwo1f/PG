#!/bin/bash

# Script pour exécuter uniquement les migrations
# Usage: ./scripts/run-migration-only.sh

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

echo "📦 Exécution des migrations uniquement..."

# Vérifier que le conteneur backend est en cours d'exécution
if ! $DOCKER_COMPOSE ps | grep -q "backend.*Up"; then
    echo "❌ Le conteneur backend n'est pas en cours d'exécution"
    echo "📋 État des conteneurs:"
    $DOCKER_COMPOSE ps
    echo ""
    echo "💡 Astuce: Démarrez d'abord les conteneurs avec: $DOCKER_COMPOSE up -d"
    exit 1
fi

# Vérifier que PostgreSQL est prêt
echo "⏳ Vérification de PostgreSQL..."
if ! $DOCKER_COMPOSE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "❌ PostgreSQL n'est pas prêt"
    exit 1
fi
echo "✅ PostgreSQL est prêt"

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
$DOCKER_COMPOSE exec -T backend npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migrations exécutées avec succès"
else
    echo "❌ Erreur lors de l'exécution des migrations"
    echo "📋 Logs détaillés:"
    $DOCKER_COMPOSE exec -T backend sh -x scripts/run-migration.sh run 2>&1 || true
    exit 1
fi

