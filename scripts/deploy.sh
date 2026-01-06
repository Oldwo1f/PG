#!/bin/bash

# Script de déploiement pour Perfect Generations
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Déploiement de Perfect Generations..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Détecter la commande Docker Compose disponible
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création du fichier .env à partir de .env.production.example..."
    if [ -f .env.production.example ]; then
        cp .env.production.example .env
        echo "✅ Fichier .env créé. Veuillez le modifier avec vos valeurs."
        exit 1
    else
        echo "❌ Fichier .env.production.example non trouvé"
        exit 1
    fi
fi

# Vérifier que JWT_SECRET est défini
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=your_very_secure" .env; then
    echo "⚠️  JWT_SECRET n'est pas configuré ou utilise la valeur par défaut"
    echo "🔐 Génération d'un JWT_SECRET sécurisé..."
    JWT_SECRET=$(openssl rand -base64 32)
    if grep -q "JWT_SECRET=" .env; then
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    else
        echo "JWT_SECRET=$JWT_SECRET" >> .env
    fi
    echo "✅ JWT_SECRET généré et ajouté au fichier .env"
fi

# Build des images Docker
echo "🔨 Construction des images Docker..."
$DOCKER_COMPOSE build --no-cache

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
$DOCKER_COMPOSE down

# Démarrer les services
echo "🚀 Démarrage des services..."
$DOCKER_COMPOSE up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de la disponibilité de PostgreSQL..."
timeout=60
counter=0
until $DOCKER_COMPOSE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout: PostgreSQL n'est pas prêt après ${timeout}s"
        exit 1
    fi
done
echo "✅ PostgreSQL est prêt"

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
timeout=60
counter=0
until $DOCKER_COMPOSE ps | grep -q "backend.*Up"; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "⚠️  Timeout: Le backend n'est pas prêt après ${timeout}s"
        echo "📋 Logs du backend:"
        $DOCKER_COMPOSE logs backend | tail -20
        break
    fi
done

# Exécuter les migrations
echo "📦 Exécution des migrations..."
./scripts/migrate.sh

# Vérifier la santé des services
echo "🏥 Vérification de la santé des services..."
sleep 5

if $DOCKER_COMPOSE ps | grep -q "Up"; then
    echo "✅ Tous les services sont démarrés"
else
    echo "⚠️  Certains services ne sont pas démarrés"
    $DOCKER_COMPOSE ps
fi

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📋 Services disponibles:"
echo "   - Frontend: https://perfectgeneration.aito-flow.com"
echo "   - Admin: https://adminperfectgeneration.aito-flow.com"
echo "   - Backend API: https://backendperfectgeneration.aito-flow.com/api"
echo "   - Health Check: https://backendperfectgeneration.aito-flow.com/api/health"
echo ""
echo "📝 Pour voir les logs: $DOCKER_COMPOSE logs -f"
echo "🛑 Pour arrêter: $DOCKER_COMPOSE down"

