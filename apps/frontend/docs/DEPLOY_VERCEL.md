# 🚀 Guide de déploiement sur Vercel

Ce guide vous explique comment déployer le frontend Arsia sur Vercel.

## 📋 Prérequis

1. Un compte [Vercel](https://vercel.com) (gratuit)
2. Votre projet doit être sur GitHub, GitLab ou Bitbucket
3. Votre backend doit être déployé et accessible (ou en cours de déploiement)

## 🔧 Étapes de déploiement

### Étape 1 : Préparer le projet

Le fichier `vercel.json` a déjà été créé dans le dossier `apps/frontend/`. Il configure :
- Le build avec Vite
- Le répertoire de sortie (`dist`)
- Les rewrites pour le routing React

### Étape 2 : Pousser votre code sur GitHub

Si ce n'est pas déjà fait :

```bash
# Vérifier que tout est commité
git status

# Pousser sur GitHub
git push origin main
```

### Étape 3 : Connecter le projet à Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New Project"** ou **"Import Project"**
3. Sélectionnez votre repository GitHub (Arsia_app)
4. Vercel détectera automatiquement que c'est un projet Vite

### Étape 4 : Configurer le projet dans Vercel

**Important :** Configurez les paramètres suivants :

#### Configuration du projet :
- **Framework Preset** : Vite (détecté automatiquement)
- **Root Directory** : `apps/frontend` ⚠️ **IMPORTANT**
- **Build Command** : `npm run build` (déjà dans vercel.json)
- **Output Directory** : `dist` (déjà dans vercel.json)
- **Install Command** : `npm install` (déjà dans vercel.json)

#### Variables d'environnement :
Cliquez sur **"Environment Variables"** et ajoutez :

```
VITE_API_URL=https://votre-backend-url.com
```

**Exemples :**
- Si votre backend est sur Heroku : `https://votre-app.herokuapp.com`
- Si votre backend est sur Railway : `https://votre-app.railway.app`
- Si votre backend est sur Render : `https://votre-app.onrender.com`
- Si votre backend est sur un VPS : `https://api.votre-domaine.com`

⚠️ **Important :** Utilisez `https://` et non `http://` pour la production !

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (environ 1-2 minutes)
3. Votre application sera disponible sur une URL comme : `https://arsia-app.vercel.app`

### Étape 6 : Configurer le backend pour accepter le domaine Vercel

Dans votre backend, mettez à jour la variable d'environnement `FRONTEND_URL` :

```env
FRONTEND_URL=https://votre-app.vercel.app
```

**Note :** Le backend a déjà été configuré pour accepter automatiquement tous les domaines `*.vercel.app`, donc cela devrait fonctionner automatiquement.

Si vous utilisez un domaine personnalisé, ajoutez-le dans la liste `allowedOrigins` du fichier `apps/backend/src/index.js`.

## 🔄 Déploiements automatiques

Une fois configuré, Vercel déploiera automatiquement votre application à chaque push sur la branche `main` (ou la branche par défaut).

## 🌐 Domaine personnalisé (optionnel)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

## 🔍 Vérification

Après le déploiement, vérifiez que :

1. ✅ L'application se charge correctement
2. ✅ Les requêtes API fonctionnent (vérifiez la console du navigateur)
3. ✅ L'authentification fonctionne
4. ✅ Les images s'affichent correctement

## 🐛 Dépannage

### Erreur CORS
Si vous avez des erreurs CORS :
- Vérifiez que `FRONTEND_URL` dans le backend correspond à l'URL Vercel
- Vérifiez que le backend accepte les domaines `*.vercel.app` (déjà configuré)

### Erreur 404 sur les routes
Le fichier `vercel.json` configure déjà les rewrites pour React Router. Si vous avez encore des problèmes, vérifiez que le fichier est bien présent.

### Variables d'environnement non prises en compte
- Les variables doivent commencer par `VITE_` pour être accessibles dans le code
- Redéployez après avoir ajouté/modifié des variables d'environnement

### Build échoue
- Vérifiez que le **Root Directory** est bien `apps/frontend`
- Vérifiez les logs de build dans Vercel pour plus de détails

## 📝 Notes importantes

- Le fichier `vercel.json` est déjà configuré dans `apps/frontend/`
- Le backend accepte automatiquement les domaines Vercel (pattern `*.vercel.app`)
- N'oubliez pas de configurer `VITE_API_URL` dans les variables d'environnement Vercel
- Utilisez toujours `https://` en production

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vite + Vercel](https://vercel.com/guides/deploying-vite)
- [Variables d'environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

