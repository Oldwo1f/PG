# Configuration Traefik pour Perfect Generations

## Vérifications nécessaires

### 1. Vérifier le réseau Traefik

Sur votre serveur, vérifiez le nom du réseau Traefik :

```bash
docker network ls | grep traefik
```

Le réseau Traefik s'appelle probablement `traefik` ou `traefik_default` ou `traefik-network`.

### 2. Modifier docker-compose.yml

Vous devez connecter vos conteneurs au réseau Traefik. Deux options :

#### Option A : Utiliser le réseau Traefik existant (Recommandé)

Modifiez `docker-compose.yml` :

```yaml
networks:
    perfectgenerations-network:
        external: true
        name: traefik # Remplacez par le nom réel de votre réseau Traefik
```

#### Option B : Connecter les conteneurs aux deux réseaux

Modifiez chaque service pour ajouter le réseau Traefik :

```yaml
services:
    backend:
        # ... autres configurations ...
        networks:
            - perfectgenerations-network
            - traefik # Ajoutez le réseau Traefik

networks:
    perfectgenerations-network:
        external: false
    traefik:
        external: true
        name: traefik # Nom réel de votre réseau Traefik
```

### 3. Vérifier la configuration Traefik

Assurez-vous que Traefik :

-   Écoute sur le port 443 (HTTPS)
-   A l'entrypoint `websecure` configuré
-   A le certificate resolver `letsencrypt` configuré
-   Est configuré pour découvrir les conteneurs Docker

Exemple de configuration Traefik (`traefik.yml` ou labels) :

```yaml
entryPoints:
    websecure:
        address: ":443"

certificatesResolvers:
    letsencrypt:
        acme:
            email: votre-email@example.com
            storage: /letsencrypt/acme.json
            httpChallenge:
                entryPoint: web

providers:
    docker:
        endpoint: "unix:///var/run/docker.sock"
        exposedByDefault: false
        network: traefik # Nom du réseau Traefik
```

### 4. Redémarrer les services

Après modification du réseau :

```bash
cd /var/www/perfectgeneration/perfectgenerations
docker-compose down
docker-compose up -d
```

### 5. Vérifier que Traefik découvre les services

```bash
# Vérifier les routes Traefik
docker exec traefik traefik version
# Ou accéder au dashboard Traefik (si activé)
```

### 6. Vérifier les DNS

Assurez-vous que les sous-domaines pointent vers votre serveur :

-   `perfectgeneration.aito-flow.com` → IP du serveur
-   `adminperfectgeneration.aito-flow.com` → IP du serveur
-   `backendperfectgeneration.aito-flow.com` → IP du serveur

```bash
# Tester les DNS
dig perfectgeneration.aito-flow.com
nslookup backendperfectgeneration.aito-flow.com
```

### 7. Tester l'accès

```bash
# Health check backend
curl -k https://backendperfectgeneration.aito-flow.com/api/health

# Frontend
curl -k https://perfectgeneration.aito-flow.com

# Admin
curl -k https://adminperfectgeneration.aito-flow.com
```

## Dépannage

### Les services ne sont pas accessibles

1. Vérifiez que les conteneurs sont sur le bon réseau :

    ```bash
    docker network inspect traefik | grep perfectgenerations
    ```

2. Vérifiez les logs Traefik :

    ```bash
    docker logs traefik
    ```

3. Vérifiez que les labels sont corrects :
    ```bash
    docker inspect perfectgenerations-backend | grep -A 10 Labels
    ```

### Erreur SSL/TLS

-   Vérifiez que Let's Encrypt peut accéder à votre serveur (port 80 ouvert)
-   Vérifiez les logs Traefik pour les erreurs de certificat
-   Attendez quelques minutes pour la génération du certificat

### Les services ne sont pas découverts par Traefik

-   Vérifiez que `traefik.enable=true` est présent dans les labels
-   Vérifiez que les conteneurs sont sur le même réseau que Traefik
-   Redémarrez Traefik après avoir ajouté les services
