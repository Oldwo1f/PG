#!/bin/bash

# Script pour trouver et corriger les labels Traefik

echo "🔍 Recherche de la configuration Traefik..."

# Vérifier comment n8n est configuré (il fonctionne probablement déjà)
echo ""
echo "📋 Labels du conteneur n8n (exemple de configuration qui fonctionne):"
docker ps --format "{{.Names}}" | grep n8n | head -1 | xargs docker inspect | grep -A 30 "Labels" | grep -i "traefik\|cert\|tls" | head -20

echo ""
echo "💡 Instructions:"
echo "1. Notez le nom du certificate resolver utilisé par n8n"
echo "2. Notez le nom de l'entrypoint (probablement 'websecure' ou 'web')"
echo "3. Modifiez docker-compose.yml avec ces valeurs"

