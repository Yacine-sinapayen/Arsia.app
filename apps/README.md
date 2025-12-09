# Arsia - MVP

Arsia aide les artisans à optimiser leur communication grâce à l'IA. L'application permet aux artisans d'uploader des photos de leurs travaux et génère automatiquement du contenu SEO optimisé.

## 🏗️ Structure du projet

Monorepo avec 2 applications :

- `apps/backend` : Backend Node.js + Express + Mongoose
- `apps/frontend` : Frontend React + Vite + Tailwind CSS

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- Clé API OpenAI

### Étapes d'installation

1. **Cloner et installer les dépendances**

```bash
# À la racine du monorepo
npm install

# Installer les dépendances de chaque app
cd apps/backend && npm install
cd ../frontend && npm install
```

2. **Configurer les variables d'environnement**

**Backend (`apps/backend/.env`)** :
```env
MONGODB_URI=mongodb://localhost:27017/iartisan
OPENAI_API_KEY=votre_cle_openai_ici
JWT_SECRET=votre_secret_jwt_changez_en_production
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:4000
```

**Frontend (`apps/frontend/.env`)** :
```env
VITE_API_URL=http://localhost:4000
```

3. **Créer le dossier uploads pour les images**

```bash
mkdir -p apps/backend/uploads
```

## 🏃 Lancement

### Développement

Ouvrir deux terminaux :

**Terminal 1 - Backend :**
```bash
cd apps/backend
npm run dev
```
Le serveur API sera disponible sur `http://localhost:4000`

**Terminal 2 - Frontend :**
```bash
cd apps/frontend
npm run dev
```
L'application web sera disponible sur `http://localhost:5173`

### Production

**Backend :**
```bash
cd apps/backend
npm start
```

**Frontend :**
```bash
cd apps/frontend
npm run build
npm run preview
```

## 📋 Fonctionnalités

### Pour les artisans

1. **Inscription / Connexion** : Création de compte avec email et mot de passe
2. **Création de publication** :
   - Upload d'une photo de travail
   - Saisie des métadonnées (titre, ville, type de travaux, date)
   - Génération automatique par IA :
     - Texte SEO optimisé (80-150 mots)
     - Mots-clés SEO pertinents
3. **Gestion des publications** :
   - Visualisation des publications (brouillons et publiées)
   - Publication des brouillons
   - Prévisualisation avant publication

### Intégration sur site vitrine

Les publications publiées peuvent être intégrées sur n'importe quel site web de deux façons :

#### Option 1 : API REST (Recommandé)

Utilisez l'API REST pour récupérer vos publications et les afficher avec votre propre design. Cette méthode offre un contrôle total sur l'affichage.

**Documentation complète :** [`docs/backend/INTEGRATION_SITE_VITRINE.md`](docs/backend/INTEGRATION_SITE_VITRINE.md)

**Exemple rapide :**
```javascript
fetch('https://votre-api.com/api/public/publications?artisanId=VOTRE_USER_ID')
  .then(response => response.json())
  .then(data => {
    // Afficher les publications avec votre propre design
    data.publications.forEach(publication => {
      // Créer vos propres cartes HTML
    });
  });
```

#### Option 2 : Widget JavaScript

Pour intégrer rapidement le portfolio d'un artisan sur un site externe, ajoutez ce code HTML :

```html
<div id="iartisan-portfolio"></div>
<script
  src="http://localhost:4000/embed/portfolio.js"
  data-artisan-id="ID_DE_L_ARTISAN">
</script>
```

Remplacez :
- `http://localhost:4000` par l'URL de votre API en production
- `ID_DE_L_ARTISAN` par l'ID MongoDB de l'artisan (ObjectId)

Le widget va automatiquement :
1. Récupérer les publications publiées de l'artisan
2. Générer des cartes HTML avec les images et descriptions
3. Les injecter dans l'élément `#iartisan-portfolio`

## 🛠️ Technologies utilisées

### Backend
- **Express** : Framework web Node.js
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification par tokens
- **bcrypt** : Hashage des mots de passe
- **Multer** : Gestion des uploads de fichiers
- **OpenAI API** : Génération de contenu SEO avec GPT-4 Vision

### Frontend
- **React** : Bibliothèque UI
- **Vite** : Build tool et dev server
- **React Router** : Routing
- **Tailwind CSS** : Framework CSS utilitaire
- **Axios** : Client HTTP

## 📁 Structure des fichiers

```
IArtisan/
├── package.json
├── README.md
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── uploads/          # Images uploadées
│   │   └── src/
│   │       ├── index.js
│   │       ├── config/
│   │       │   └── db.js
│   │       ├── models/
│   │       │   ├── User.js
│   │       │   └── Publication.js
│   │       ├── routes/
│   │       │   ├── auth.js
│   │       │   ├── publications.js
│   │       │   ├── public.js
│   │       │   └── embed.js
│   │       ├── middleware/
│   │       │   ├── authMiddleware.js
│   │       │   └── errorHandler.js
│   │       └── services/
│   │           └── openaiService.js
│   └── frontend/
│       ├── package.json
│       ├── .env.example
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── index.html
│       ├── public/
│       │   ├── manifest.json
│       │   └── service-worker.js
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── pages/
│           │   ├── Login.jsx
│           │   ├── Signup.jsx
│           │   └── Dashboard.jsx
│           ├── components/
│           │   ├── PublicationForm.jsx
│           │   └── PublicationCard.jsx
│           └── styles/
│               └── index.css
```

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- JWT stockés en cookies HTTP-only
- Validation des fichiers uploadés (type et taille)
- Middleware d'authentification pour les routes protégées
- CORS configuré pour le frontend

## 📝 Notes

- Ceci est un MVP, certaines fonctionnalités peuvent être simplifiées
- En production, configurez correctement les variables d'environnement
- Assurez-vous que MongoDB est accessible
- La clé API OpenAI est requise pour la génération de contenu SEO
- Les images sont stockées localement dans `apps/backend/uploads/` (en production, utilisez un service de stockage cloud)

## 🐛 Dépannage

**Erreur de connexion MongoDB** :
- Vérifiez que MongoDB est démarré
- Vérifiez la variable `MONGODB_URI` dans `.env`

**Erreur OpenAI** :
- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits disponibles

**Images non affichées** :
- Vérifiez que le dossier `uploads` existe
- Vérifiez les permissions du dossier
- Vérifiez que la route `/uploads` est bien servie par Express

## 📚 Documentation

Toute la documentation du projet est organisée dans le dossier [`docs/`](./docs/) :

- **Backend** (`docs/backend/`) : API, MongoDB, authentification, gestion des utilisateurs
- **Frontend** (`docs/frontend/`) : Flux de l'application, composants React

Consultez le [README du dossier docs](./docs/README.md) pour la liste complète et la navigation.

## 📄 Licence

Ce projet est un MVP de démonstration.

