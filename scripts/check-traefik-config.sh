#!/bin/bash

# Script pour vérifier la configuration Traefik et trouver le certificate resolver

echo "🔍 Vérification de la configuration Traefik..."

# Vérifier le certificate resolver
echo ""
echo "📋 Certificate Resolvers dans Traefik:"
docker inspect n8n-traefik-1 | grep -i "certresolver\|certificatesresolver" | head -10

echo ""
echo "📋 Labels du conteneur Traefik:"
docker inspect n8n-traefik-1 | grep -A 50 "Labels" | grep -i "cert\|tls\|acme" | head -20

echo ""
echo "📋 Entrypoints dans Traefik:"
docker inspect n8n-traefik-1 | grep -i "entrypoint" | head -10

echo ""
echo "📋 Vérification des conteneurs sur le réseau n8n_default:"
docker network inspect n8n_default --format='{{range .Containers}}{{.Name}} {{end}}'

echo ""
echo "💡 Si vous voyez d'autres services fonctionner avec Traefik, inspectez leurs labels:"
echo "   docker inspect <nom-conteneur> | grep -A 20 Labels"

