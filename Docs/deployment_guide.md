# Guide de Déploiement - POS.AI Activation Portal

Ce guide explique comment déployer l'application **POS.AI Activation Portal** sur deux plateformes distinctes : **Google Cloud Run** (pour une infrastructure conteneurisée et évolutive) et **Vercel via GitHub** (pour un déploiement rapide et continu).

---

## 0. Prérequis Techniques

Avant de déployer, assurez-vous que votre projet est prêt pour la production. Comme votre projet utilise TypeScript (`.tsx`) et React, il ne peut pas être servi tel quel par un navigateur classique sans une étape de **build**.

Assurez-vous d'avoir à la racine du projet :
1.  Un `package.json` (avec des scripts de build, ex: `npm run build` via Vite).
2.  Un `tsconfig.json`.
3.  Un outil de build comme **Vite** (recommandé).

---

## Option 1 : Déploiement sur Google Cloud Run

Google Cloud Run permet d'exécuter des conteneurs sans serveur. C'est l'option recommandée pour un environnement d'entreprise sécurisé et isolé.

### Étape 1 : Créer le Dockerfile

Créez un fichier nommé `Dockerfile` à la racine du projet. Ce fichier va construire l'application et la servir via un serveur Nginx léger.

```dockerfile
# Étape 1 : Build de l'application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configuration Nginx pour le SPA (Single Page App)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 2 : Construire et Pousser l'image

Assurez-vous d'avoir le **Google Cloud SDK** installé et initialisé.

1.  **Activer les services nécessaires :**
    ```bash
    gcloud services enable run.googleapis.com containerregistry.googleapis.com
    ```

2.  **Construire l'image (via Cloud Build) :**
    Remplacez `[PROJECT_ID]` par votre ID de projet Google Cloud.
    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT_ID]/pos-ai-activation
    ```

### Étape 3 : Déployer sur Cloud Run

Une fois l'image construite, déployez-la :

```bash
gcloud run deploy pos-ai-activation \
  --image gcr.io/[PROJECT_ID]/pos-ai-activation \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

*Note : Retirez `--allow-unauthenticated` si vous souhaitez restreindre l'accès à l'application.*

---

## Option 2 : Déploiement via GitHub et Vercel

Vercel est la méthode la plus simple pour les projets Frontend React. Elle offre un CI/CD automatique (déploiement à chaque push).

### Étape 1 : Pousser le code sur GitHub

1.  Initialisez git si ce n'est pas fait : `git init`.
2.  Créez un repository sur GitHub.
3.  Poussez votre code :
    ```bash
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/VOTRE_USER/pos-ai-activation.git
    git push -u origin main
    ```

### Étape 2 : Connecter Vercel

1.  Allez sur [vercel.com](https://vercel.com) et connectez-vous.
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Sélectionnez **"Continue with GitHub"**.
4.  Cherchez le repository `pos-ai-activation` et cliquez sur **"Import"**.

### Étape 3 : Configuration du Build

Vercel détecte généralement automatiquement qu'il s'agit d'un projet React/Vite.

*   **Framework Preset :** Vite (ou Create React App selon votre config).
*   **Root Directory :** `./`
*   **Build Command :** `npm run build` (ou commande équivalente).
*   **Output Directory :** `dist` (pour Vite) ou `build` (pour CRA).

### Étape 4 : Validation

1.  Cliquez sur **"Deploy"**.
2.  Attendez que Vercel installe les dépendances et construise le projet.
3.  Une fois terminé, vous obtiendrez une URL du type `https://pos-ai-activation.vercel.app`.

---

## Résumé des différences

| Critère | Google Cloud Run | Vercel |
| :--- | :--- | :--- |
| **Complexité** | Moyenne (Docker requis) | Faible (Automatique) |
| **Coût** | Paiement à l'usage (Free tier généreux) | Gratuit (Hobby) / Payant (Pro) |
| **Contrôle** | Total (OS, Réseau, Sécurité) | Abstraction élevée |
| **Cas d'usage** | Entreprise, Conformité, Backend intégré | Prototypes, Sites publics, Vitesse |
