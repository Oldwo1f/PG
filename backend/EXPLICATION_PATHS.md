# 📁 Explication des Chemins - Docker vs Serveur Hôte

## Concepts Importants

### 1. `/app` = Chemin DANS le Container Docker

Dans le Dockerfile, on voit :
```dockerfile
WORKDIR /app
```

Cela signifie que **dans le container Docker**, le répertoire de travail est `/app`.

**Sur le serveur hôte**, il n'y a **PAS** de dossier `/app`. C'est uniquement dans le container !

### 2. Structure sur le Serveur Hôte

Sur votre serveur, les fichiers sont dans :
```
/var/www/htmlToIMG/perfectgenerations/backend/
```

### 3. Volumes Docker

Le `docker-compose.yml` définit :
```yaml
volumes:
  - backend_uploads:/app/uploads
  - backend_assets:/app/assets
```

Cela signifie :
- **Dans le container** : `/app/uploads` et `/app/assets`
- **Sur le serveur hôte** : Ces dossiers sont stockés dans un volume Docker (généralement dans `/var/lib/docker/volumes/`)

## Où sont VRAIMENT les fichiers ?

### Option 1 : Vérifier via Docker (Recommandé)

```bash
# Voir où le volume est monté dans le container
docker inspect perfectgenerations-backend | grep -A 10 "Mounts"

# Voir où le volume est stocké sur le serveur hôte
docker volume inspect perfectgenerations_backend_assets
```

### Option 2 : Chercher sur le serveur hôte

Les volumes Docker sont généralement dans :
```bash
/var/lib/docker/volumes/perfectgenerations_backend_assets/_data/
```

Mais le nom exact peut varier. Vérifiez avec :
```bash
docker volume ls | grep assets
docker volume inspect <nom_du_volume>
```

## Le Problème

### Avant le Fix
- Les fichiers étaient créés dans : `/app/dist/assets/templatePreviews` (dans le container)
- Ce dossier n'est **PAS** monté dans un volume Docker
- Donc les fichiers sont perdus quand le container est recréé/redémarré

### Après le Fix
- Les fichiers seront créés dans : `/app/assets/templatePreviews` (dans le container)
- Ce dossier **EST** monté dans le volume Docker `backend_assets`
- Donc les fichiers sont persistés même après redémarrage

## Commandes Utiles

### Voir les fichiers dans le container
```bash
docker exec perfectgenerations-backend ls -lah /app/assets/templatePreviews/
```

### Voir où le volume est monté
```bash
docker exec perfectgenerations-backend mount | grep assets
```

### Accéder au volume sur le serveur hôte
```bash
# Trouver le chemin du volume
VOLUME_PATH=$(docker volume inspect perfectgenerations_backend_assets --format '{{ .Mountpoint }}')
echo "Volume monté à : $VOLUME_PATH"

# Lister les fichiers
ls -lah "$VOLUME_PATH/templatePreviews/"
```

## Résumé

- **`/app`** = Chemin dans le container Docker (pas sur le serveur hôte)
- **`/var/www/htmlToIMG/perfectgenerations/backend/`** = Chemin sur le serveur hôte
- **Volume Docker** = Stockage persistant monté dans le container
- Les fichiers de preview doivent être dans `/app/assets/templatePreviews` (dans le container) pour être persistés
