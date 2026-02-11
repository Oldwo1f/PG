# 🔧 Fix - Images Preview dans uploads/preview

## Solution Appliquée

Les images de preview sont maintenant stockées dans `uploads/preview` au lieu de `assets/templatePreviews`.

### Avantages

1. ✅ Le volume `backend_uploads` est déjà monté et fonctionne bien
2. ✅ Cohérent avec les autres images dans `uploads/images`
3. ✅ Persiste après rebuild du container
4. ✅ Le dossier sera créé automatiquement si nécessaire

## Fichiers Modifiés

1. `backend/src/template/template-preview.service.ts` - Création des fichiers dans `uploads/preview`
2. `backend/src/template/template.controller.ts` - Service des fichiers depuis `uploads/preview`
3. `backend/Dockerfile` - Création du dossier `uploads/preview` au build

## Déploiement

### 1. Rebuild le backend

```bash
cd /var/www/htmlToIMG/perfectgenerations

# Rebuild le backend
docker-compose build backend

# Redémarrer le backend
docker-compose up -d backend

# Vérifier les logs
docker logs -f perfectgenerations-backend
```

### 2. Vérifier que le dossier existe

```bash
# Vérifier dans le container
docker exec perfectgenerations-backend ls -lah /app/uploads/preview/

# Le dossier devrait être créé automatiquement, mais si ce n'est pas le cas :
docker exec perfectgenerations-backend mkdir -p /app/uploads/preview
```

### 3. Tester la création d'une preview

1. Créez un nouveau template avec preview dans l'interface admin
2. Vérifiez que le fichier est créé :

```bash
docker exec perfectgenerations-backend ls -lah /app/uploads/preview/
```

### 4. Vérifier que l'image s'affiche

- Ouvrez la galerie de templates
- Vérifiez que la preview s'affiche correctement
- Testez après un redémarrage pour confirmer la persistance :

```bash
docker-compose restart backend
# Attendre quelques secondes
docker exec perfectgenerations-backend ls -lah /app/uploads/preview/
```

Les fichiers doivent toujours être là car ils sont dans le volume Docker `backend_uploads`.

## Structure Finale

```
Container Docker: /app/uploads/
├── images/          ← Images uploadées par les utilisateurs
└── preview/         ← Images de preview des templates (NOUVEAU)
```

## Notes

- Les anciennes previews dans `dist/assets/templatePreviews` ne seront plus utilisées
- Les nouvelles previews seront créées dans `uploads/preview`
- Le dossier est créé automatiquement lors de la première génération de preview
- Les fichiers persistent après rebuild car ils sont dans le volume Docker `backend_uploads`
