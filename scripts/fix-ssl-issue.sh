#!/bin/bash

# Script pour résoudre le problème SSL
# Usage: ./scripts/fix-ssl-issue.sh

set -e

echo "🔧 Résolution du problème SSL"
echo "=============================="
echo ""

# Trouver le conteneur Traefik
TRAEFIK_CONTAINER=$(docker ps --format "{{.Names}}" | grep -i traefik | head -1)

if [ -z "$TRAEFIK_CONTAINER" ]; then
    echo "❌ Conteneur Traefik non trouvé"
    exit 1
fi

echo "✅ Conteneur Traefik: $TRAEFIK_CONTAINER"
echo ""

# Vérifier l'heure actuelle et le rate limit
echo "⏰ Vérification du rate limiting Let's Encrypt..."
echo ""

# Extraire l'heure de retry depuis les logs
RETRY_TIME=$(docker logs "$TRAEFIK_CONTAINER" 2>&1 | grep -i "retry after" | tail -1 | grep -oP "retry after \K[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" || echo "")

if [ -n "$RETRY_TIME" ]; then
    echo "   ⚠️  Let's Encrypt a bloqué les tentatives"
    echo "   📅 Retry après: $RETRY_TIME UTC"
    echo ""
    echo "   💡 Attendez jusqu'à cette heure avant de redémarrer Traefik"
    echo ""
else
    echo "   ✅ Pas de rate limiting actif"
    echo ""
fi

# Vérifier les DNS
echo "🌐 Vérification des DNS..."
echo ""

DOMAINS=("backendperfectgeneration.aito-flow.com" "adminperfectgeneration.aito-flow.com" "perfectgeneration.aito-flow.com")

for domain in "${DOMAINS[@]}"; do
    echo "   Vérification de $domain..."
    
    # Vérifier avec nslookup
    NSLOOKUP_RESULT=$(nslookup "$domain" 2>/dev/null | grep -A 2 "Name:" | tail -1 | awk '{print $2}' || echo "")
    
    # Vérifier avec host (si disponible)
    HOST_RESULT=$(host "$domain" 2>/dev/null | grep -oP "has address \K[0-9.]+" || echo "")
    
    if [ -n "$NSLOOKUP_RESULT" ] || [ -n "$HOST_RESULT" ]; then
        RESOLVED_IP="${HOST_RESULT:-$NSLOOKUP_RESULT}"
        if [ "$RESOLVED_IP" = "185.211.4.81" ] || [ "$RESOLVED_IP" = "aito-flow.com" ]; then
            echo "   ✅ Résout correctement"
        else
            echo "   ⚠️  Résout vers: $RESOLVED_IP (attendu: 185.211.4.81)"
        fi
    else
        echo "   ❌ Ne résout pas"
    fi
done

echo ""

# Vérifier si les conteneurs sont sur le bon réseau
echo "🔗 Vérification de la connexion au réseau Traefik..."
echo ""

NETWORK_NAME="n8n_default"
CONTAINERS=("perfectgenerations-backend" "perfectgenerations-frontend" "perfectgenerations-frontadmin")

for container in "${CONTAINERS[@]}"; do
    if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
        NETWORKS=$(docker inspect "$container" 2>/dev/null | grep -A 5 "Networks" | grep "$NETWORK_NAME" || echo "")
        if [ -n "$NETWORKS" ]; then
            echo "   ✅ $container est connecté au réseau $NETWORK_NAME"
        else
            echo "   ❌ $container n'est PAS connecté au réseau $NETWORK_NAME"
            echo "      💡 Reconnexion nécessaire: docker network connect $NETWORK_NAME $container"
        fi
    else
        echo "   ⚠️  $container n'est pas en cours d'exécution"
    fi
done

echo ""

# Recommandations
echo "📋 Recommandations"
echo "=================="
echo ""

if [ -n "$RETRY_TIME" ]; then
    echo "1. ⏰ Attendez jusqu'à $RETRY_TIME UTC (rate limiting Let's Encrypt)"
    echo ""
fi

echo "2. 🌐 Vérifiez que les DNS sont bien propagés:"
echo "   - Les CNAME pointent vers aito-flow.com"
echo "   - aito-flow.com résout vers 185.211.4.81"
echo ""

echo "3. 🔄 Après avoir attendu le rate limit, redémarrez Traefik:"
echo "   docker restart $TRAEFIK_CONTAINER"
echo ""

echo "4. ⏳ Attendez 5-10 minutes pour la génération des certificats"
echo ""

echo "5. 🔍 Surveillez les logs:"
echo "   docker logs -f $TRAEFIK_CONTAINER"
echo ""

echo "6. ✅ Testez les certificats:"
echo "   curl -I https://backendperfectgeneration.aito-flow.com/api/health"
echo "   curl -I https://adminperfectgeneration.aito-flow.com"
echo "   curl -I https://perfectgeneration.aito-flow.com"

