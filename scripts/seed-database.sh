#!/bin/bash

# Script pour lancer les seeds (plans et admin)
# Usage: ./scripts/seed-database.sh

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

echo "🌱 Initialisation de la base de données avec les seeds..."

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

# 1. Lancer le seed des plans
echo ""
echo "📦 Création des plans..."
$DOCKER_COMPOSE exec -T backend npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Plans créés avec succès"
else
    echo "❌ Erreur lors de la création des plans"
    exit 1
fi

# 2. Créer l'utilisateur admin
echo ""
echo "👤 Création de l'utilisateur admin..."
echo "   Email: alexis@alexis.fr"
echo "   Mot de passe: Alexis09"
echo "   Rôle: ADMIN"
echo ""

$DOCKER_COMPOSE exec -T backend npm run create-admin

if [ $? -eq 0 ]; then
    echo "✅ Utilisateur admin créé avec succès"
else
    echo "❌ Erreur lors de la création de l'utilisateur admin"
    exit 1
fi

echo ""
echo "✅ Seeds terminés avec succès!"
echo ""
echo "📋 Informations de connexion:"
echo "   Email: alexis@alexis.fr"
echo "   Mot de passe: Alexis09"
echo "   URL Admin: https://adminperfectgeneration.aito-flow.com"

