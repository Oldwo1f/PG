# 🔧 Fix - Images Preview Manquantes

## Problème Identifié

Les images de preview étaient créées dans `/app/dist/assets/templatePreviews` mais le volume Docker monte `/app/assets`. Les fichiers n'étaient donc pas persistés dans le volume Docker et étaient perdus.

## Solution Appliquée

Le code a été modifié pour utiliser `process.cwd()` en production (qui pointe vers `/app` dans Docker) au lieu de `__dirname` (qui pointe vers `dist/template/`).

### Fichiers Modifiés

1. `backend/src/template/template-preview.service.ts` - Création des fichiers
2. `backend/src/template/template.controller.ts` - Service des fichiers

## Commandes de Test (Docker)

### 1. Vérifier le problème actuel

```bash
# Exécuter le script de diagnostic
cd /var/www/htmlToIMG/perfectgenerations/backend
./scripts/diagnose-docker.sh

# Ou manuellement
docker exec perfectgenerations-backend ls -lah /app/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"
docker exec perfectgenerations-backend ls -lah /app/dist/assets/templatePreviews 2>/dev/null || echo "❌ Dossier n'existe pas"
```

### 2. Rebuild et redémarrer le container backend

```bash
cd /var/www/htmlToIMG/perfectgenerations

# Rebuild uniquement le backend
docker-compose build backend

# Redémarrer le backend
docker-compose up -d backend

# Vérifier les logs
docker logs -f perfectgenerations-backend
```

### 3. Tester la création d'une nouvelle preview

1. Créez un nouveau template avec preview dans l'interface admin
2. Vérifiez que le fichier est créé dans le bon dossier :

```bash
# Vérifier que le fichier est dans /app/assets/templatePreviews
docker exec perfectgenerations-backend ls -lah /app/assets/templatePreviews/

# Vérifier que le fichier n'est PAS dans /app/dist/assets/templatePreviews
docker exec perfectgenerations-backend ls -lah /app/dist/assets/templatePreviews/ 2>/dev/null || echo "✅ Dossier n'existe pas (normal)"
```

### 4. Vérifier que l'image s'affiche

- Ouvrez la galerie de templates
- Vérifiez que la nouvelle preview s'affiche correctement
- Vérifiez que l'image persiste après un redémarrage du container

### 5. Migrer les anciens fichiers (si ils existent)

Si des fichiers existent dans `/app/dist/assets/templatePreviews`, vous pouvez les déplacer :

```bash
# Entrer dans le container
docker exec -it perfectgenerations-backend sh

# Créer le dossier de destination
mkdir -p /app/assets/templatePreviews

# Déplacer les fichiers (si ils existent)
mv /app/dist/assets/templatePreviews/* /app/assets/templatePreviews/ 2>/dev/null || echo "Aucun fichier à déplacer"

# Vérifier
ls -lah /app/assets/templatePreviews/

exit
```

## Vérification Post-Déploiement

```bash
# 1. Vérifier que le dossier existe dans le volume Docker
docker exec perfectgenerations-backend ls -lah /app/assets/templatePreviews/

# 2. Créer un fichier de test
docker exec perfectgenerations-backend sh -c "echo 'test' > /app/assets/templatePreviews/test.txt"

# 3. Vérifier que le fichier persiste après redémarrage
docker-compose restart backend
docker exec perfectgenerations-backend cat /app/assets/templatePreviews/test.txt

# 4. Nettoyer
docker exec perfectgenerations-backend rm /app/assets/templatePreviews/test.txt
```

## Régénérer les Previews Manquantes

Si vous avez des templates avec `previewImage` en base mais sans fichier, vous devrez les régénérer :

1. Via l'interface admin : éditez chaque template et régénérez la preview
2. Ou créez un script de régénération automatique (à faire si nécessaire)

## Notes

- Les fichiers créés avant cette correction étaient dans `dist/assets/templatePreviews` et ne sont pas persistés
- Les nouveaux fichiers seront créés dans `/app/assets/templatePreviews` qui est monté dans le volume Docker `backend_assets`
- Le volume Docker persiste les données même après redémarrage du container
