# 🔍 Guide de Diagnostic - Images de Preview Manquantes

## Problème
Les images de preview des templates créés hier retournent 404, alors que les nouvelles images fonctionnent.

## Solution Automatique (Recommandée)

Exécutez le script de diagnostic automatique :

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
npm run diagnose:preview
```

Ou directement :

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
./scripts/diagnose-preview-images.sh
```

## Diagnostic Manuel

### 1. Vérifier où sont stockées les images

Les images peuvent être dans plusieurs emplacements selon l'environnement :

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Vérifier les dossiers possibles
echo "=== Dossier src/assets/templatePreviews ==="
ls -lah src/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"

echo ""
echo "=== Dossier dist/assets/templatePreviews ==="
ls -lah dist/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"

echo ""
echo "=== Dossier dist/src/assets/templatePreviews ==="
ls -lah dist/src/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"
```

### 2. Vérifier le chemin utilisé par le serveur

Le serveur utilise `__dirname` qui pointe vers le code compilé. Vérifiez où le serveur cherche réellement :

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Trouver où est le controller compilé
find dist -name "template.controller.js" -type f

# Depuis dist/template/, le chemin serait ../assets/templatePreviews
# Vérifier ce chemin
if [ -f "dist/template/template.controller.js" ]; then
    cd dist/template
    echo "Chemin depuis dist/template/:"
    ls -lah ../assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"
    cd ../..
fi
```

### 3. Lister tous les fichiers de preview existants

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

echo "=== Fichiers dans src/assets/templatePreviews ==="
find src/assets/templatePreviews -type f -name "*.png" 2>/dev/null | wc -l
find src/assets/templatePreviews -type f -name "*.png" 2>/dev/null | head -20

echo ""
echo "=== Fichiers dans dist/assets/templatePreviews ==="
find dist/assets/templatePreviews -type f -name "*.png" 2>/dev/null | wc -l
find dist/assets/templatePreviews -type f -name "*.png" 2>/dev/null | head -20

echo ""
echo "=== Fichiers dans dist/src/assets/templatePreviews ==="
find dist/src/assets/templatePreviews -type f -name "*.png" 2>/dev/null | wc -l
find dist/src/assets/templatePreviews -type f -name "*.png" 2>/dev/null | head -20
```

### 4. Vérifier les templates dans la base de données

Connectez-vous à PostgreSQL et exécutez :

```sql
-- Lister tous les templates avec previewImage
SELECT 
    id,
    name,
    "previewImage",
    "createdAt",
    "updatedAt"
FROM templates
WHERE "previewImage" IS NOT NULL
ORDER BY "createdAt" DESC;
```

### 5. Comparer les fichiers DB vs fichiers système

Créez un script temporaire pour comparer :

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Extraire les noms de fichiers depuis la DB (nécessite psql)
psql -h localhost -U votre_user -d votre_db -t -c "
SELECT \"previewImage\" FROM templates WHERE \"previewImage\" IS NOT NULL;
" | sort > /tmp/db_files.txt

# Extraire les fichiers sur le disque
find . -path "*/templatePreviews/*.png" -type f -exec basename {} \; | sort > /tmp/disk_files.txt

# Comparer
echo "=== Fichiers dans DB mais pas sur disque ==="
comm -23 /tmp/db_files.txt /tmp/disk_files.txt

echo ""
echo "=== Fichiers sur disque mais pas dans DB ==="
comm -13 /tmp/db_files.txt /tmp/disk_files.txt

# Nettoyer
rm /tmp/db_files.txt /tmp/disk_files.txt
```

### 6. Vérifier les dates de modification des fichiers

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Lister les fichiers avec leurs dates
find . -path "*/templatePreviews/*.png" -type f -exec ls -lh {} \; | \
    awk '{print $9, $6, $7, $8}' | \
    sort -k2 -k3 -k4
```

### 7. Vérifier les logs du serveur

```bash
# Vérifier où le serveur crée les fichiers
# Regardez les logs lors de la création d'une nouvelle preview
tail -f /var/log/votre-app.log | grep -i "templatePreviews\|preview"

# Ou si vous utilisez PM2
pm2 logs | grep -i "templatePreviews\|preview"
```

### 8. Vérifier si un script de nettoyage a été exécuté

```bash
# Chercher des scripts de nettoyage
find /var/www/htmlToIMG/perfectgenerations -name "*clean*" -o -name "*tmp*" -o -name "*temp*"

# Vérifier l'historique bash (si disponible)
history | grep -i "rm\|delete\|clean\|templatePreviews"
```

## Solutions Possibles

### Solution 1: Les fichiers sont dans un autre dossier

Si les fichiers existent mais dans un autre emplacement, vous pouvez :

1. **Les déplacer vers le bon dossier** :
```bash
# Trouver où sont réellement les fichiers
find /var/www/htmlToIMG/perfectgenerations -name "*.png" -path "*/templatePreviews/*" -type f

# Les copier vers le bon emplacement (selon votre configuration)
mkdir -p dist/assets/templatePreviews
cp -r src/assets/templatePreviews/* dist/assets/templatePreviews/
```

### Solution 2: Les fichiers ont été supprimés

Si les fichiers n'existent plus, vous devez les régénérer :

1. **Régénérer toutes les previews manquantes** (nécessite un script)
2. **Ou régénérer manuellement** via l'interface admin

### Solution 3: Problème de chemin (__dirname)

Le problème peut venir du fait que `__dirname` change selon l'environnement. 

**Solution recommandée** : Utiliser un chemin absolu ou une variable d'environnement.

Modifiez `template-preview.service.ts` et `template.controller.ts` pour utiliser un chemin absolu :

```typescript
// Au lieu de:
const previewsDir = path.join(__dirname, '../assets/templatePreviews');

// Utiliser:
const previewsDir = process.env.PREVIEWS_DIR || path.join(process.cwd(), 'assets', 'templatePreviews');
```

Puis définissez `PREVIEWS_DIR` dans votre `.env` :

```bash
PREVIEWS_DIR=/var/www/htmlToIMG/perfectgenerations/backend/assets/templatePreviews
```

## Commandes Rapides

```bash
# Diagnostic complet en une commande
cd /var/www/htmlToIMG/perfectgenerations/backend && \
echo "=== Dossiers ===" && \
ls -d */assets/templatePreviews 2>/dev/null && \
echo "" && \
echo "=== Nombre de fichiers ===" && \
find . -path "*/templatePreviews/*.png" | wc -l && \
echo "" && \
echo "=== Derniers fichiers modifiés ===" && \
find . -path "*/templatePreviews/*.png" -type f -exec ls -lt {} \; | head -10
```
