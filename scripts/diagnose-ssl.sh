#!/bin/bash

# Script de diagnostic SSL pour Perfect Generations
# Usage: ./scripts/diagnose-ssl.sh

set -e

echo "🔍 Diagnostic SSL pour Perfect Generations"
echo "=========================================="
echo ""

# 1. Trouver le conteneur Traefik
echo "1️⃣  Recherche du conteneur Traefik..."
TRAEFIK_CONTAINER=$(docker ps --format "{{.Names}}" | grep -i traefik | head -1)

if [ -z "$TRAEFIK_CONTAINER" ]; then
    echo "❌ Aucun conteneur Traefik trouvé"
    exit 1
fi

echo "✅ Conteneur Traefik trouvé: $TRAEFIK_CONTAINER"
echo ""

# 2. Vérifier les DNS
echo "2️⃣  Vérification des DNS..."
echo ""

DOMAINS=("backendperfectgeneration.aito-flow.com" "adminperfectgeneration.aito-flow.com" "perfectgeneration.aito-flow.com")
ALL_DNS_OK=true

for domain in "${DOMAINS[@]}"; do
    echo "   Vérification de $domain..."
    RESULT=$(nslookup "$domain" 2>/dev/null | grep -A 2 "Name:" | tail -1 | awk '{print $2}' || echo "")
    if [ -n "$RESULT" ]; then
        echo "   ✅ Résout vers: $RESULT"
    else
        echo "   ❌ Ne résout pas correctement"
        ALL_DNS_OK=false
    fi
done

echo ""

# 3. Vérifier les logs Traefik pour les erreurs
echo "3️⃣  Analyse des logs Traefik (dernières erreurs)..."
echo ""

ERRORS=$(docker logs "$TRAEFIK_CONTAINER" 2>&1 | grep -i "error\|certificate\|acme" | tail -10)

if [ -z "$ERRORS" ]; then
    echo "   ✅ Aucune erreur récente dans les logs"
else
    echo "   ⚠️  Erreurs trouvées:"
    echo "$ERRORS" | sed 's/^/      /'
fi

echo ""

# 4. Vérifier les certificats générés
echo "4️⃣  Vérification des certificats..."
echo ""

# Chercher dans différents emplacements possibles
CERT_PATHS=("/letsencrypt" "/data/letsencrypt" "/acme.json" "/data/acme.json")

CERT_FOUND=false
for path in "${CERT_PATHS[@]}"; do
    if docker exec "$TRAEFIK_CONTAINER" test -d "$path" 2>/dev/null || docker exec "$TRAEFIK_CONTAINER" test -f "$path" 2>/dev/null; then
        echo "   ✅ Certificats trouvés dans: $path"
        CERT_FOUND=true
        docker exec "$TRAEFIK_CONTAINER" ls -lah "$path" 2>/dev/null | head -5 | sed 's/^/      /' || true
        break
    fi
done

if [ "$CERT_FOUND" = false ]; then
    echo "   ⚠️  Aucun dossier de certificats trouvé dans les emplacements standards"
fi

echo ""

# 5. Vérifier la configuration du certificate resolver
echo "5️⃣  Vérification de la configuration Traefik..."
echo ""

# Vérifier si mytlschallenge est mentionné dans les logs
CERT_RESOLVER=$(docker logs "$TRAEFIK_CONTAINER" 2>&1 | grep -i "mytlschallenge\|certresolver" | head -1)

if [ -n "$CERT_RESOLVER" ]; then
    echo "   ✅ Certificate resolver trouvé dans les logs"
    echo "$CERT_RESOLVER" | sed 's/^/      /'
else
    echo "   ⚠️  Certificate resolver 'mytlschallenge' non trouvé dans les logs"
fi

echo ""

# 6. Vérifier la connexion des conteneurs au réseau Traefik
echo "6️⃣  Vérification de la connexion au réseau Traefik..."
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
        fi
    else
        echo "   ⚠️  $container n'est pas en cours d'exécution"
    fi
done

echo ""

# 7. Résumé et recommandations
echo "📋 Résumé et Recommandations"
echo "=============================="
echo ""

if [ "$ALL_DNS_OK" = true ] && [ "$CERT_FOUND" = true ]; then
    echo "✅ Configuration semble correcte"
    echo ""
    echo "💡 Si Chrome affiche toujours 'Non sécurisé':"
    echo "   1. Attendez 5-10 minutes pour la génération complète des certificats"
    echo "   2. Redémarrez Traefik: docker restart $TRAEFIK_CONTAINER"
    echo "   3. Videz le cache de Chrome (Ctrl+Shift+Delete)"
    echo "   4. Testez en navigation privée"
elif [ "$ALL_DNS_OK" = false ]; then
    echo "❌ Problème DNS détecté"
    echo "   Vérifiez que les enregistrements DNS pointent vers 185.211.4.81"
elif [ "$CERT_FOUND" = false ]; then
    echo "⚠️  Certificats non trouvés"
    echo "   Les certificats peuvent être en cours de génération"
    echo "   Redémarrez Traefik: docker restart $TRAEFIK_CONTAINER"
    echo "   Attendez 5-10 minutes et relancez ce script"
fi

echo ""
echo "🔍 Pour voir les logs en temps réel:"
echo "   docker logs -f $TRAEFIK_CONTAINER"

