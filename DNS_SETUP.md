# Configuration DNS pour Perfect Generations

## Problème actuel

Les erreurs Traefik indiquent que les sous-domaines ne sont pas configurés dans le DNS :
- `backendperfectgeneration.aito-flow.com` → NXDOMAIN
- `adminperfectgeneration.aito-flow.com` → NXDOMAIN
- `perfectgeneration.aito-flow.com` → NXDOMAIN

## Solution : Configurer les DNS

### 1. Vérifier les DNS actuels

```bash
# Tester les DNS
dig backendperfectgeneration.aito-flow.com
dig adminperfectgeneration.aito-flow.com
dig perfectgeneration.aito-flow.com

# Ou avec nslookup
nslookup backendperfectgeneration.aito-flow.com
```

### 2. Configurer les enregistrements DNS

Dans votre panneau de contrôle DNS (chez votre registrar ou votre fournisseur DNS), ajoutez ces enregistrements **A** :

```
Type: A
Host: backendperfectgeneration
Value: 185.211.4.81
TTL: 3600 (ou Auto)

Type: A
Host: adminperfectgeneration
Value: 185.211.4.81
TTL: 3600 (ou Auto)

Type: A
Host: perfectgeneration
Value: 185.211.4.81
TTL: 3600 (ou Auto)
```

**Note importante** : Vérifiez le format exact de votre domaine. Vous mentionnez que `n8n.aitoflow.com` fonctionne (sans tiret), mais dans la config on a `aito-flow.com` (avec tiret). 

### 3. Vérifier le format du domaine

Vérifiez quel est le format correct :
- `aito-flow.com` (avec tiret) ?
- `aitoflow.com` (sans tiret) ?

Si c'est `aitoflow.com` sans tiret, il faut modifier les labels dans `docker-compose.yml` :

```yaml
# Au lieu de :
- "traefik.http.routers.backend.rule=Host(`backendperfectgeneration.aito-flow.com`)"

# Utiliser :
- "traefik.http.routers.backend.rule=Host(`backendperfectgeneration.aitoflow.com`)"
```

### 4. Après configuration DNS

Une fois les DNS configurés :

1. Attendre la propagation DNS (5-30 minutes généralement)
2. Vérifier que les DNS pointent bien :
   ```bash
   dig backendperfectgeneration.aito-flow.com +short
   # Devrait retourner : 185.211.4.81
   ```

3. Redémarrer Traefik pour forcer la génération des certificats :
   ```bash
   docker restart n8n-traefik-1
   ```

4. Vérifier les logs Traefik :
   ```bash
   docker logs n8n-traefik-1 | tail -30
   ```

### 5. Test d'accès

Une fois les DNS propagés et les certificats générés :

```bash
# Health check
curl https://backendperfectgeneration.aito-flow.com/api/health

# Frontend
curl -I https://perfectgeneration.aito-flow.com

# Admin
curl -I https://adminperfectgeneration.aito-flow.com
```

## Dépannage

### Les DNS ne se propagent pas

- Vérifiez que les enregistrements sont bien créés dans votre panneau DNS
- Utilisez `dig` avec différents serveurs DNS : `dig @8.8.8.8 backendperfectgeneration.aito-flow.com`
- Attendez jusqu'à 48h pour la propagation complète (généralement 5-30 min)

### Les certificats ne se génèrent pas

- Vérifiez que le port 80 est ouvert (nécessaire pour le challenge HTTP)
- Vérifiez les logs Traefik pour les erreurs spécifiques
- Assurez-vous que les DNS pointent bien vers 185.211.4.81

