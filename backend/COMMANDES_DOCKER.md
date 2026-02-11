# 🐳 Commandes Docker - Diagnostic Images Preview

## Container Backend
Le container backend s'appelle : `perfectgenerations-backend`

## Commandes de Diagnostic

### 1. Vérifier où sont les fichiers dans le container

```bash
# Entrer dans le container backend
docker exec -it perfectgenerations-backend sh

# Une fois dans le container, vérifier les emplacements
ls -lah /app/assets/templatePreviews 2>/dev/null || echo "❌ /app/assets/templatePreviews n'existe pas"
ls -lah /app/dist/assets/templatePreviews 2>/dev/null || echo "❌ /app/dist/assets/templatePreviews n'existe pas"
ls -lah /app/src/assets/templatePreviews 2>/dev/null || echo "❌ /app/src/assets/templatePreviews n'existe pas"

# Chercher tous les fichiers PNG récents
find /app -name "*.png" -type f -mtime -1 2>/dev/null | head -20

# Sortir du container
exit
```

### 2. Vérifier les volumes Docker

```bash
# Voir où sont montés les volumes
docker inspect perfectgenerations-backend | grep -A 10 "Mounts"

# Voir le contenu du volume backend_assets
docker volume inspect perfectgenerations_backend_assets

# Lister les fichiers dans le volume (nécessite d'entrer dans le container)
docker exec perfectgenerations-backend ls -lah /app/assets/
```

### 3. Vérifier où le code cherche les fichiers

```bash
# Entrer dans le container et vérifier le chemin depuis dist/template/
docker exec -it perfectgenerations-backend sh

# Simuler __dirname depuis le controller compilé
cd /app/dist/template
node -e "console.log('__dirname depuis dist/template:', __dirname);"
node -e "const path = require('path'); console.log('Chemin preview:', path.join(__dirname, '../assets/templatePreviews'));"

# Vérifier si ce chemin existe
ls -lah ../assets/templatePreviews 2>/dev/null || echo "❌ Le chemin n'existe pas"

exit
```

### 4. Vérifier les templates dans la base de données

```bash
# Se connecter à PostgreSQL dans le container
docker exec -it perfectgenerations-postgres psql -U postgres -d perfectgenerations

# Dans PostgreSQL, exécuter :
SELECT name, "previewImage", "createdAt"
FROM templates
WHERE "previewImage" IS NOT NULL
ORDER BY "createdAt" DESC
LIMIT 10;

# Sortir
\q
```

### 5. Chercher un fichier spécifique dans le container

```bash
# Remplacez NOM_DU_FICHIER.png par le nom réel depuis la DB
docker exec perfectgenerations-backend find /app -name "NOM_DU_FICHIER.png" -type f 2>/dev/null

# Ou chercher tous les PNG récents
docker exec perfectgenerations-backend find /app -name "*.png" -type f -mtime -1 2>/dev/null
```

### 6. Vérifier les logs du serveur lors de la création d'une preview

```bash
# Surveiller les logs en temps réel
docker logs -f perfectgenerations-backend | grep -i "preview\|templatePreviews"

# Ou voir les dernières lignes
docker logs --tail 100 perfectgenerations-backend | grep -i "preview\|templatePreviews"
```

### 7. Créer un fichier de test et voir où il est créé

```bash
# Entrer dans le container
docker exec -it perfectgenerations-backend sh

# Créer un fichier de test dans différents emplacements
echo "test" > /app/assets/templatePreviews/test.txt 2>&1 || echo "❌ Impossible d'écrire dans /app/assets/templatePreviews"
echo "test" > /app/dist/assets/templatePreviews/test.txt 2>&1 || echo "❌ Impossible d'écrire dans /app/dist/assets/templatePreviews"

# Vérifier où le fichier a été créé
find /app -name "test.txt" -type f 2>/dev/null

# Nettoyer
rm -f /app/assets/templatePreviews/test.txt /app/dist/assets/templatePreviews/test.txt 2>/dev/null

exit
```

### 8. Vérifier les permissions

```bash
docker exec perfectgenerations-backend ls -lah /app/assets/
docker exec perfectgenerations-backend ls -lah /app/dist/assets/ 2>/dev/null || echo "Dossier n'existe pas"
docker exec perfectgenerations-backend whoami
```

### 9. Vérifier le working directory et __dirname réel

```bash
docker exec perfectgenerations-backend node -e "
const path = require('path');
console.log('process.cwd():', process.cwd());
console.log('__dirname depuis dist/template:', path.join(__dirname, '../assets/templatePreviews'));
" 2>/dev/null || docker exec perfectgenerations-backend sh -c "cd /app/dist/template && node -e \"const path = require('path'); console.log('Chemin:', path.join(__dirname, '../assets/templatePreviews'));\""
```

### 10. Script de diagnostic complet (à exécuter dans le container)

```bash
docker exec -it perfectgenerations-backend sh << 'EOF'
echo "=== Diagnostic Preview Images ==="
echo ""
echo "1. Vérification des dossiers:"
echo "   /app/assets/templatePreviews:"
ls -lah /app/assets/templatePreviews 2>/dev/null || echo "   ❌ N'existe pas"
echo ""
echo "   /app/dist/assets/templatePreviews:"
ls -lah /app/dist/assets/templatePreviews 2>/dev/null || echo "   ❌ N'existe pas"
echo ""
echo "2. Chemin depuis dist/template (simulation __dirname):"
cd /app/dist/template 2>/dev/null && pwd && ls -lah ../assets/templatePreviews 2>/dev/null || echo "   ❌ Chemin invalide"
echo ""
echo "3. Fichiers PNG récents dans /app:"
find /app -name "*.png" -type f -mtime -1 2>/dev/null | head -10
echo ""
echo "4. Permissions:"
ls -lah /app/assets/ 2>/dev/null
ls -lah /app/dist/assets/ 2>/dev/null || echo "   Dossier dist/assets n'existe pas"
EOF
```

## Commandes Rapides (One-liners)

```bash
# Vérifier si le dossier templatePreviews existe dans le container
docker exec perfectgenerations-backend ls -lah /app/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"

# Compter les fichiers PNG dans le container
docker exec perfectgenerations-backend find /app -name "*.png" -type f | wc -l

# Voir les derniers fichiers PNG créés
docker exec perfectgenerations-backend find /app -name "*.png" -type f -exec ls -lt {} \; 2>/dev/null | head -10

# Vérifier les logs récents
docker logs --tail 50 perfectgenerations-backend | grep -i "preview\|404\|not found"
```

## Solution Probable

Si les fichiers sont créés dans `/app/dist/assets/templatePreviews` mais que le volume Docker monte `/app/assets`, alors les fichiers ne sont **pas persistés** dans le volume Docker et sont perdus à chaque redémarrage du container.

**Solution** : Modifier le code pour créer les fichiers dans `/app/assets/templatePreviews` au lieu de `dist/assets/templatePreviews`.
