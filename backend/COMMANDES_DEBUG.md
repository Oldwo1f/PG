# 🔍 Commandes de Debug - Images Preview Manquantes

## Problème
Les images de preview fonctionnent dans le navigateur mais aucun fichier n'existe sur le serveur.

## Commandes à Exécuter

### 1. Vérifier où le serveur cherche les fichiers

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
npm run check:preview-routes
```

### 2. Vérifier les logs du serveur lors de la création d'une preview

```bash
# Si vous utilisez PM2
pm2 logs | grep -i "preview\|templatePreviews"

# Ou si vous avez des logs dans un fichier
tail -f /var/log/votre-app.log | grep -i "preview\|templatePreviews"
```

### 3. Vérifier où les fichiers sont réellement créés

Créez un nouveau template avec preview et surveillez :

```bash
# Dans un terminal, surveillez les créations de fichiers
watch -n 1 'find /var/www/htmlToIMG/perfectgenerations/backend -name "*.png" -type f -newer /tmp/marker 2>/dev/null | head -20'

# Créez un marqueur temporel
touch /tmp/marker

# Créez ensuite une preview dans l'interface
# Les nouveaux fichiers apparaîtront dans le watch
```

### 4. Vérifier le chemin exact utilisé par le serveur en cours d'exécution

```bash
# Trouver le processus Node.js qui tourne
ps aux | grep node

# Vérifier le working directory du processus
pwdx $(pgrep -f "node.*dist/main")

# Vérifier où __dirname pointe réellement
cd /var/www/htmlToIMG/perfectgenerations/backend/dist/template
node -e "console.log(__dirname); console.log(require('path').join(__dirname, '../assets/templatePreviews'));"
```

### 5. Vérifier si les fichiers sont dans un cache ou un dossier temporaire

```bash
# Chercher dans /tmp
find /tmp -name "*.png" -path "*template*" 2>/dev/null

# Chercher dans les dossiers de cache système
find /var/cache -name "*.png" -path "*template*" 2>/dev/null 2>/dev/null

# Chercher partout dans le projet
cd /var/www/htmlToIMG/perfectgenerations
find . -name "*.png" -type f -mtime -1 | head -20
```

### 6. Tester manuellement la route de preview

```bash
# Récupérer un nom de fichier depuis la DB
psql -h localhost -U votre_user -d votre_db -t -c "
SELECT \"previewImage\" FROM templates WHERE \"previewImage\" IS NOT NULL LIMIT 1;
" | head -1 > /tmp/preview_filename.txt

PREVIEW_FILE=$(cat /tmp/preview_filename.txt)

# Tester la route directement
curl -I http://localhost:3001/api/templates/preview/$PREVIEW_FILE

# Vérifier la réponse
```

### 7. Vérifier si le serveur génère l'image à la volée

Ajoutez des logs dans le controller pour voir ce qui se passe :

```bash
# Vérifier le code compilé
grep -A 10 "getPreviewImage" /var/www/htmlToIMG/perfectgenerations/backend/dist/template/template.controller.js
```

### 8. Vérifier les permissions et l'existence des dossiers

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Vérifier les permissions
ls -la dist/assets/ 2>/dev/null
ls -la src/assets/ 2>/dev/null
ls -la assets/ 2>/dev/null

# Vérifier si les dossiers peuvent être créés
mkdir -p dist/assets/templatePreviews && echo "✅ dist/assets/templatePreviews créable" || echo "❌ Impossible de créer"
mkdir -p src/assets/templatePreviews && echo "✅ src/assets/templatePreviews créable" || echo "❌ Impossible de créer"
```

### 9. Vérifier le cache du navigateur

Si l'image fonctionne dans le navigateur mais pas sur le serveur, c'est peut-être du cache :

```bash
# Dans le navigateur, ouvrez les DevTools (F12)
# Onglet Network, cochez "Disable cache"
# Rechargez la page
# Vérifiez si l'image charge toujours
```

### 10. Vérifier si les fichiers sont créés puis supprimés

```bash
# Installer inotify-tools si nécessaire
# sudo apt-get install inotify-tools

# Surveiller les créations/suppressions dans le dossier backend
inotifywait -m -r --format '%w%f %e' /var/www/htmlToIMG/perfectgenerations/backend -e create -e delete | grep -i "png\|preview"
```

## Solution Probable

Si les fichiers sont créés mais supprimés immédiatement, ou créés dans un mauvais endroit, le problème vient probablement de :

1. **Chemin incorrect** : `__dirname` pointe vers un mauvais endroit
2. **Dossier temporaire** : Les fichiers sont créés dans `/tmp` et supprimés
3. **Permissions** : Le serveur ne peut pas écrire dans le bon dossier
4. **Cache** : Le navigateur utilise une version en cache

## Prochaines Étapes

1. Exécutez `npm run check:preview-routes` pour voir où le serveur cherche
2. Créez une nouvelle preview et surveillez où le fichier est créé
3. Comparez les deux chemins - s'ils diffèrent, c'est le problème !
