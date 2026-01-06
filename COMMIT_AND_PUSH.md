# Commandes pour Commit et Push sur GitHub

## Étape 1 : Vérifier l'état

```bash
cd /var/www/htmlToIMG/perfectgenerations
git status
```

## Étape 2 : Créer le commit

```bash
git commit -m "feat: Configuration complète Docker et déploiement

- Conversion en monorepo Git (suppression sous-modules)
- Ajout docker-compose.yml avec PostgreSQL, Redis et services
- Ajout Dockerfiles pour backend, frontend et frontAdmin
- Ajout scripts de déploiement (deploy.sh, migrate.sh, backup-db.sh)
- Ajout .env.production.example
- Configuration Traefik pour les sous-domaines
- Corrections sécurité (CORS, JWT validation, logging, etc.)
- Health check endpoint
- Exception filter global
- Rate limiting
- Logging structuré avec Winston"
```

## Étape 3 : Choisir le remote et push

Vous avez 2 remotes configurés :

-   `Oldwo1lf` → https://github.com/Oldwo1f/perfectgenerations.git
-   `origin` → https://github.com/Oldwo1f/PG.git (nouveau repo)

### Option A : Pousser sur le nouveau repo (PG.git)

```bash
git push origin master
# ou
git push origin main
```

### Option B : Pousser sur l'ancien repo (perfectgenerations.git)

```bash
git push Oldwo1lf master
```

### Option C : Pousser sur les deux

```bash
git push origin master
git push Oldwo1lf master
```

## Étape 4 : Sur le serveur, cloner

```bash
# Sur le serveur
cd /var/www/perfectgeneration

# Cloner depuis le nouveau repo
git clone https://github.com/Oldwo1f/PG.git perfectgenerations

# Ou depuis l'ancien repo
git clone https://github.com/Oldwo1f/perfectgenerations.git perfectgenerations

cd perfectgenerations

# Vérifier qu'il n'y a qu'un seul .git
find . -name ".git" -type d
# Devrait afficher seulement: ./.git

# Créer .env
cp .env.production.example .env
nano .env

# Déployer
chmod +x scripts/*.sh
./scripts/deploy.sh
```
