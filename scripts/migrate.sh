#!/bin/bash

# Script d'exécution des migrations
# Usage: ./scripts/migrate.sh

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

echo "📦 Exécution des migrations de base de données..."

# Vérifier que le conteneur backend est en cours d'exécution
if ! $DOCKER_COMPOSE ps | grep -q "backend.*Up"; then
    echo "❌ Le conteneur backend n'est pas en cours d'exécution"
    echo "📋 État des conteneurs:"
    $DOCKER_COMPOSE ps
    echo "📋 Logs du backend:"
    $DOCKER_COMPOSE logs backend | tail -30
    exit 1
fi

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
echo "📋 Vérification du script de migration dans le conteneur..."
$DOCKER_COMPOSE exec -T backend ls -la scripts/run-migration.sh 2>&1 || echo "⚠️  Script non trouvé"

echo "📋 Exécution de la migration..."
if $DOCKER_COMPOSE exec -T backend npm run migration:run; then
    echo "✅ Migrations exécutées avec succès"
else
    echo "❌ Erreur lors de l'exécution des migrations"
    echo "📋 Logs détaillés:"
    $DOCKER_COMPOSE exec -T backend bash -x scripts/run-migration.sh run 2>&1 || true
    exit 1
fi

