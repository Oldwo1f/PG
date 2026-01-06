#!/bin/bash

# Script de build rapide (avec cache)
# Usage: ./scripts/build-only.sh [--no-cache]

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

echo "🔨 Construction des images Docker..."

if [ "$1" = "--no-cache" ]; then
    echo "🔄 Reconstruction complète (sans cache)..."
    $DOCKER_COMPOSE build --no-cache
else
    echo "⚡ Construction avec cache (plus rapide)..."
    $DOCKER_COMPOSE build
fi

echo "✅ Build terminé!"

