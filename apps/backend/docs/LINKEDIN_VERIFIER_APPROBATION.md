# Comment vérifier l'approbation de "Share on LinkedIn"

## 📍 Où vérifier dans LinkedIn Developers

### 1. Accéder à votre application

1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Connectez-vous avec votre compte LinkedIn
3. Cliquez sur votre application (dans la liste des applications)

### 2. Vérifier l'onglet "Products"

1. Dans le menu de gauche, cliquez sur **"Products"** (ou "Produits")
2. Vous verrez une liste de produits disponibles

### 3. Trouver "Share on LinkedIn"

Cherchez le produit **"Share on LinkedIn"** dans la liste. Vous verrez son statut :

#### ✅ **Approved** (Approuvé)
- Statut : **"Approved"** ou **"Approuvé"**
- Couleur : Vert ou avec une coche ✅
- Signification : Vous pouvez utiliser les permissions `r_organization_social` et `w_organization_social`

#### ⏳ **Pending** (En attente)
- Statut : **"Pending"** ou **"En attente"** ou **"Under review"**
- Couleur : Jaune/Orange ou avec une horloge ⏳
- Signification : Votre demande est en cours d'examen par LinkedIn

#### ❌ **Not requested** (Non demandé)
- Statut : **"Request access"** ou **"Demander l'accès"**
- Couleur : Gris ou avec un bouton
- Signification : Vous n'avez pas encore demandé l'accès

#### 🔴 **Rejected** (Refusé)
- Statut : **"Rejected"** ou **"Refusé"**
- Couleur : Rouge
- Signification : Votre demande a été refusée (vous pouvez réessayer)

## 📸 À quoi ça ressemble

Dans l'onglet "Products", vous verrez quelque chose comme :

```
Products
├── Sign In with LinkedIn using OpenID Connect
│   └── Status: ✅ Approved
│
└── Share on LinkedIn
    └── Status: ⏳ Pending (ou Request access)
```

## 🔍 Détails supplémentaires

Si vous cliquez sur "Share on LinkedIn", vous pourrez voir :
- **Date de demande** (si en attente)
- **Date d'approbation** (si approuvé)
- **Raison du refus** (si refusé)
- **Permissions incluses** :
  - `w_member_social` - Publier sur profil personnel
  - `r_organization_social` - Lire les pages d'entreprise
  - `w_organization_social` - Publier sur pages d'entreprise

## ⚠️ Si vous ne voyez pas "Share on LinkedIn"

Si le produit n'apparaît pas dans la liste :

1. Vérifiez que vous êtes sur la bonne application
2. Vérifiez que vous êtes connecté avec le bon compte LinkedIn
3. Le produit peut être masqué - cherchez dans tous les onglets

## 📝 Alternative : Vérifier via l'API

Vous pouvez aussi vérifier les permissions disponibles via l'API, mais c'est plus complexe. La méthode la plus simple reste de vérifier dans LinkedIn Developers.

## 🚀 Une fois approuvé

Quand le statut passe à **"Approved"** :

1. **Redémarrez votre serveur backend**
2. **Retirez** `LINKEDIN_USE_ORGANIZATION_SCOPES=false` de votre `.env` (si vous l'avez ajouté)
3. **Déconnectez-vous de LinkedIn** dans votre navigateur (ou utilisez navigation privée)
4. **Reconnectez-vous** depuis votre application
5. Vous devriez voir la page d'autorisation avec toutes les permissions

## ⏱️ Délai d'approbation

- **Typique** : 1-3 jours ouvrables
- **Parfois** : Quelques heures
- **Parfois** : Jusqu'à une semaine

LinkedIn examine chaque demande manuellement, donc les délais peuvent varier.

