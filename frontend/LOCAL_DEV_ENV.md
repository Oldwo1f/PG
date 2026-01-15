## Configuration API en local (frontend)

### Cas 1 — Backend local

Dans ton shell (ou dans un fichier `.env` local si tu en utilises un), définis :

```bash
export NUXT_PUBLIC_API_BASE="http://localhost:3001/api"
```

### Cas 2 — Backend distant (éviter les erreurs CORS en dev)

Le navigateur appelle `/api/...` (same-origin) et Nuxt **proxy** vers le backend distant.

```bash
export NUXT_PUBLIC_API_BASE="/api"
export NUXT_API_PROXY_TARGET="https://backendperfectgeneration.aito-flow.com"
```

Puis lance le dev server :

```bash
yarn dev
```

