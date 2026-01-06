# Dépannage SSL - Certificats non sécurisés

## Problème

Chrome affiche "Non sécurisé" pour les applications, même si elles sont accessibles via HTTPS.

## Causes possibles

### 1. Certificats SSL non encore générés

Les certificats Let's Encrypt peuvent prendre quelques minutes à générer. Vérifiez les logs Traefik :

```bash
docker logs n8n-traefik-1 | grep -i "certificate\|acme\|error" | tail -30
```

### 2. Certificats auto-signés ou expirés

Si Traefik utilise des certificats auto-signés ou expirés, Chrome les marquera comme non sécurisés.

### 3. Configuration du certificate resolver incorrecte

Vérifiez que le certificate resolver `mytlschallenge` est bien configuré dans Traefik.

## Solutions

### Solution 1 : Vérifier la génération des certificats

```bash
# Vérifier les certificats générés
docker exec n8n-traefik-1 ls -la /letsencrypt/

# Vérifier les logs pour les erreurs
docker logs n8n-traefik-1 2>&1 | grep -i "certificate\|acme" | tail -50
```

### Solution 2 : Forcer la régénération des certificats

```bash
# Redémarrer Traefik pour forcer la génération
docker restart n8n-traefik-1

# Attendre quelques minutes et vérifier les logs
sleep 60
docker logs n8n-traefik-1 | tail -30
```

### Solution 3 : Vérifier la configuration Traefik

Assurez-vous que Traefik est configuré pour :
- Utiliser le challenge TLS (pas HTTP)
- Avoir accès au port 443
- Avoir le bon email pour Let's Encrypt

### Solution 4 : Vérifier les DNS

Les certificats ne peuvent pas être générés si les DNS ne pointent pas correctement :

```bash
# Vérifier que les DNS pointent vers le serveur
dig backendperfectgeneration.aito-flow.com +short
dig adminperfectgeneration.aito-flow.com +short
dig perfectgeneration.aito-flow.com +short

# Tous doivent retourner : 185.211.4.81
```

### Solution 5 : Vérifier le certificat dans le navigateur

1. Cliquez sur l'icône de cadenas dans Chrome
2. Cliquez sur "Certificat"
3. Vérifiez :
   - L'émetteur (devrait être Let's Encrypt)
   - La date d'expiration
   - Le domaine

### Solution 6 : Attendre la propagation

Si les DNS viennent d'être configurés, attendez 5-30 minutes pour :
- La propagation DNS
- La génération des certificats par Let's Encrypt

## Commandes de diagnostic

```bash
# Vérifier l'état des certificats
docker exec n8n-traefik-1 cat /letsencrypt/acme.json 2>/dev/null | jq . 2>/dev/null || echo "Fichier acme.json non trouvé ou non lisible"

# Vérifier les routes Traefik
docker exec n8n-traefik-1 traefik version

# Tester les certificats
openssl s_client -connect backendperfectgeneration.aito-flow.com:443 -servername backendperfectgeneration.aito-flow.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

## Si les certificats ne se génèrent toujours pas

1. Vérifiez que le port 80 est ouvert (nécessaire pour le challenge HTTP si utilisé)
2. Vérifiez que les DNS pointent bien vers 185.211.4.81
3. Vérifiez les logs Traefik pour les erreurs spécifiques
4. Attendez jusqu'à 1 heure pour la génération complète

