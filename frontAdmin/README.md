# Perfect Generations - Dashboard d'Administration

Ce projet contient le dashboard d'administration pour l'application Perfect Generations.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le serveur de développement sera accessible sur `http://localhost:3002`

## 📁 Structure du projet

```
frontAdmin/
├── assets/
│   └── css/
│       └── main.css          # Styles CSS principaux
├── components/               # Composants Vue réutilisables
├── layouts/
│   └── default.vue          # Layout par défaut
├── pages/
│   └── index.vue            # Page d'accueil du dashboard
├── stores/                  # Stores Pinia
├── app.vue                  # Composant racine
├── nuxt.config.ts           # Configuration Nuxt
├── package.json             # Dépendances du projet
└── tailwind.config.js       # Configuration Tailwind CSS
```

## 🛠️ Technologies utilisées

-   **Nuxt 3** - Framework Vue.js
-   **TypeScript** - Typage statique
-   **Tailwind CSS** - Framework CSS utilitaire
-   **Pinia** - Gestion d'état
-   **Vue 3** - Framework JavaScript

## 🎨 Styles

Le projet utilise Tailwind CSS avec des classes utilitaires personnalisées pour l'administration :

-   `.admin-card` - Cartes d'administration
-   `.admin-button` - Boutons de base
-   `.admin-button-primary` - Boutons primaires
-   `.admin-button-secondary` - Boutons secondaires
-   `.admin-input` - Champs de saisie
-   `.admin-table` - Tableaux d'administration

## 🔧 Scripts disponibles

-   `npm run dev` - Lance le serveur de développement
-   `npm run build` - Compile l'application pour la production
-   `npm run preview` - Prévisualise la version de production
-   `npm run test` - Lance les tests
-   `npm run test:coverage` - Lance les tests avec couverture

## 🌐 Configuration

Le projet est configuré pour se connecter à l'API backend sur :

-   **Développement** : `http://localhost:3001/api`
-   **Production** : `https://api.perfectgenerations.com/api`

## 📝 Fonctionnalités

-   Dashboard d'administration avec statistiques
-   Interface moderne et responsive
-   Système de navigation
-   Gestion des utilisateurs (à implémenter)
-   Gestion des templates (à implémenter)
-   Gestion des marques (à implémenter)
