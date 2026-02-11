# 🚀 Commandes de Diagnostic - Images Preview

## Méthode Rapide (Recommandée)

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
npm run diagnose:preview
```

## Méthode Alternative

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
./scripts/diagnose-preview-images.sh
```

## Commandes Manuelles Rapides

### 1. Vérifier où sont les fichiers

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Vérifier tous les emplacements possibles
ls -lah src/assets/templatePreviews/ 2>/dev/null && echo "✅ Trouvé dans src/"
ls -lah dist/assets/templatePreviews/ 2>/dev/null && echo "✅ Trouvé dans dist/"
ls -lah dist/src/assets/templatePreviews/ 2>/dev/null && echo "✅ Trouvé dans dist/src/"
```

### 2. Compter les fichiers

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
find . -path "*/templatePreviews/*.png" -type f | wc -l
```

### 3. Voir les derniers fichiers créés

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend
find . -path "*/templatePreviews/*.png" -type f -exec ls -lt {} \; | head -20
```

### 4. Vérifier dans la base de données (PostgreSQL)

```bash
# Remplacez les valeurs par vos identifiants
psql -h localhost -U votre_user -d votre_db -c "
SELECT 
    name,
    \"previewImage\",
    \"createdAt\"
FROM templates
WHERE \"previewImage\" IS NOT NULL
ORDER BY \"createdAt\" DESC
LIMIT 20;
"
```

### 5. Vérifier le chemin utilisé par le serveur

```bash
cd /var/www/htmlToIMG/perfectgenerations/backend

# Si le serveur tourne depuis dist/
if [ -d "dist/template" ]; then
    cd dist/template
    echo "Chemin depuis dist/template/:"
    ls -lah ../assets/templatePreviews/ 2>/dev/null || echo "❌ Dossier n'existe pas"
    cd ../..
fi
```

## Prochaines Étapes

Après avoir exécuté le diagnostic, consultez `DIAGNOSTIC_PREVIEW_IMAGES.md` pour les solutions détaillées.
