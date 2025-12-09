# 🚀 Guide de déploiement du backend sur Render

Ce guide vous explique comment déployer le backend Arsia sur Render.

## 📋 Prérequis

1. Un compte [Render](https://render.com) (gratuit)
2. Votre projet doit être sur GitHub, GitLab ou Bitbucket
3. Un cluster MongoDB Atlas configuré (ou MongoDB local)
4. Vos clés API (OpenAI, LinkedIn, etc.)

## 🔧 Étapes de déploiement

### Étape 1 : Préparer le projet

Le fichier `render.yaml` a déjà été créé dans le dossier `apps/backend/`. Il configure :
- Le type de service (web)
- Les commandes de build et start
- Les variables d'environnement nécessaires

### Étape 2 : Configurer MongoDB Atlas

**Important :** Render utilise des IPs dynamiques, donc vous devez autoriser toutes les IPs dans MongoDB Atlas :

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Cliquez sur **"Network Access"** dans le menu de gauche
3. Cliquez sur **"Add IP Address"**
4. Entrez `0.0.0.0/0` (autorise toutes les IPs)
5. Cliquez sur **"Confirm"**

⚠️ **Note :** C'est acceptable pour le développement, mais en production, vous pouvez restreindre aux IPs de Render si nécessaire.

### Étape 3 : Pousser votre code sur GitHub

Si ce n'est pas déjà fait :

```bash
# Vérifier que tout est commité
git status

# Pousser sur GitHub
git add .
git commit -m "chore: configuration pour déploiement Render"
git push origin main
```

### Étape 4 : Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec GitHub (recommandé pour l'intégration automatique)

### Étape 5 : Créer un nouveau service Web

1. Dans le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub si ce n'est pas déjà fait
4. Sélectionnez votre repository (Arsia_app)

### Étape 6 : Configurer le service

**Configuration de base :**
- **Name** : `arsia-backend` (ou le nom de votre choix)
- **Region** : Choisissez la région la plus proche (ex: Frankfurt, Ireland)
- **Branch** : `main` (ou votre branche principale)
- **Root Directory** : `apps/backend` ⚠️ **IMPORTANT**
- **Runtime** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

**Plan :**
- Pour commencer, choisissez **"Free"** (limité mais gratuit)
- Pour la production, choisissez **"Starter"** ou supérieur (pas de mise en veille)

### Étape 7 : Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez toutes les variables suivantes :

#### Variables obligatoires :

```env
NODE_ENV=production
PORT=10000
```

#### MongoDB :
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/iartisan?retryWrites=true&w=majority
```
⚠️ Remplacez par votre URI MongoDB Atlas complète.

#### JWT Secret :
```env
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire
```
⚠️ Utilisez un secret fort et unique. Vous pouvez générer un secret avec :
```bash
node generate-jwt-secret.js
```

#### OpenAI :
```env
OPENAI_API_KEY=sk-votre_cle_openai
```

#### Frontend URL :
```env
FRONTEND_URL=https://votre-app.vercel.app
```
⚠️ Remplacez par l'URL de votre frontend déployé sur Vercel.

#### API URL :
```env
API_URL=https://arsia-backend.onrender.com
```
⚠️ Remplacez par l'URL que Render vous donnera après le déploiement (format : `https://votre-service.onrender.com`)

#### LinkedIn API :
```env
LINKEDIN_CLIENT_ID=votre_linkedin_client_id
LINKEDIN_CLIENT_SECRET=votre_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://arsia-backend.onrender.com/api/linkedin/callback
```
⚠️ Remplacez l'URL de callback par celle de votre service Render.

### Étape 8 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Démarrer votre application (`npm start`)
3. Attendez que le déploiement se termine (environ 2-5 minutes)

### Étape 9 : Obtenir l'URL de votre API

Une fois déployé, Render vous donnera une URL comme :
```
https://arsia-backend.onrender.com
```

⚠️ **Important :** Notez cette URL, vous en aurez besoin pour :
- Mettre à jour `API_URL` dans les variables d'environnement Render
- Mettre à jour `VITE_API_URL` dans Vercel (frontend)
- Mettre à jour `LINKEDIN_REDIRECT_URI` dans Render et LinkedIn

### Étape 10 : Mettre à jour les URLs

Après avoir obtenu l'URL Render, mettez à jour :

1. **Dans Render** → Variables d'environnement :
   - `API_URL` = `https://arsia-backend.onrender.com`
   - `LINKEDIN_REDIRECT_URI` = `https://arsia-backend.onrender.com/api/linkedin/callback`

2. **Dans Vercel** → Variables d'environnement :
   - `VITE_API_URL` = `https://arsia-backend.onrender.com`

3. **Dans LinkedIn Developer Portal** :
   - Mettez à jour l'URL de callback autorisée

4. **Redéployez** les deux services (Render et Vercel) pour prendre en compte les changements

## 🔄 Déploiements automatiques

Une fois configuré, Render déploiera automatiquement votre application à chaque push sur la branche `main` (ou la branche configurée).

## ⚠️ Limitations du plan gratuit

- **Mise en veille** : Après 15 minutes d'inactivité, le service se met en veille
- **Temps de démarrage** : Le premier appel après mise en veille peut prendre 30-60 secondes
- **Limites de ressources** : CPU et RAM limités

Pour éviter la mise en veille en production, utilisez un plan payant ou un service de ping (comme UptimeRobot).

## 📁 Gestion des fichiers uploadés

⚠️ **Important :** Sur Render, le système de fichiers est éphémère. Les fichiers uploadés dans `/uploads` seront perdus à chaque redéploiement.

**Solutions :**
1. **Utiliser un service de stockage cloud** (recommandé) :
   - AWS S3
   - Cloudinary
   - Google Cloud Storage
   - Azure Blob Storage

2. **Utiliser un volume persistant** (plans payants uniquement)

## 🔍 Vérification

Après le déploiement, vérifiez que :

1. ✅ Le service démarre sans erreur (vérifiez les logs)
2. ✅ La route `/health` fonctionne : `https://arsia-backend.onrender.com/health`
3. ✅ La connexion MongoDB fonctionne (vérifiez les logs)
4. ✅ Les routes API répondent correctement

## 🐛 Dépannage

### Le service ne démarre pas

**Vérifiez les logs dans Render :**
1. Allez dans votre service → **"Logs"**
2. Cherchez les erreurs de démarrage
3. Vérifiez que toutes les variables d'environnement sont définies

**Erreurs courantes :**
- `MONGODB_URI is not defined` → Ajoutez la variable `MONGODB_URI`
- `Cannot find module` → Vérifiez que `Root Directory` est bien `apps/backend`
- `Port already in use` → Vérifiez que `PORT=10000` est défini (Render utilise le port 10000)

### Erreur de connexion MongoDB

1. Vérifiez que MongoDB Atlas autorise toutes les IPs (`0.0.0.0/0`)
2. Vérifiez que l'URI MongoDB est correcte
3. Vérifiez les logs MongoDB dans Render

### Erreur CORS

Le backend accepte automatiquement :
- Les domaines `*.vercel.app` (frontend)
- Les domaines `*.onrender.com` (si vous avez d'autres services)
- L'URL définie dans `FRONTEND_URL`

Si vous avez encore des erreurs CORS, vérifiez que `FRONTEND_URL` est bien configuré.

### Le service se met en veille

C'est normal avec le plan gratuit. Solutions :
1. Utiliser un service de ping (UptimeRobot, cron-job.org)
2. Passer à un plan payant
3. Accepter le délai de démarrage (30-60 secondes)

## 🔐 Sécurité

⚠️ **Important pour la production :**

1. **JWT Secret** : Utilisez un secret fort et unique
2. **MongoDB** : Restreignez les IPs autorisées si possible
3. **Variables d'environnement** : Ne commitez jamais vos `.env`
4. **HTTPS** : Render fournit HTTPS automatiquement
5. **Rate limiting** : Considérez l'ajout d'un rate limiter (express-rate-limit)

## 📝 Notes importantes

- Le fichier `render.yaml` est déjà configuré dans `apps/backend/`
- Le backend accepte automatiquement les domaines Render (pattern `*.onrender.com`)
- Render utilise le port `10000` par défaut (défini dans les variables d'environnement)
- Les fichiers uploadés ne persistent pas sur le plan gratuit (utilisez un service cloud)

## 🔗 Liens utiles

- [Documentation Render](https://render.com/docs)
- [Render Dashboard](https://dashboard.render.com)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Générer un JWT Secret](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx)

## 📊 Monitoring

Render fournit des logs en temps réel :
- Allez dans votre service → **"Logs"**
- Surveillez les erreurs et les performances
- Configurez des alertes si nécessaire

## 🚀 Prochaines étapes

Après avoir déployé le backend :

1. ✅ Mettez à jour `VITE_API_URL` dans Vercel
2. ✅ Testez toutes les fonctionnalités
3. ✅ Configurez un domaine personnalisé (optionnel)
4. ✅ Configurez un service de ping pour éviter la mise en veille
5. ✅ Configurez un stockage cloud pour les uploads

