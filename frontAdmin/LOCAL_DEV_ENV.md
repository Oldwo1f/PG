## Configuration API en local (frontAdmin)

### Cas 1 — Backend local

```bash
export NUXT_PUBLIC_API_BASE="http://localhost:3001/api"
```

### Cas 2 — Backend distant (éviter les erreurs CORS en dev)

```bash
export NUXT_PUBLIC_API_BASE="/api"
export NUXT_API_PROXY_TARGET="https://backendperfectgeneration.aito-flow.com"
```

Puis lance le dev server :

```bash
yarn dev
```

