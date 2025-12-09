# 🔐 JWT_SECRET - Guide Complet

## À quoi sert le JWT_SECRET ?

Le `JWT_SECRET` est une **clé secrète** utilisée pour sécuriser vos tokens d'authentification JWT (JSON Web Tokens). Il a deux rôles essentiels :

### 1. **Signature des tokens** (lors de la création)
Quand un utilisateur s'inscrit ou se connecte, le serveur crée un token JWT qui contient :
- L'ID de l'utilisateur
- Son email
- La date d'expiration

Ce token est **signé** avec le `JWT_SECRET` pour garantir qu'il n'a pas été modifié.

### 2. **Vérification des tokens** (lors des requêtes authentifiées)
À chaque requête protégée (création de publication, etc.), le serveur :
- Récupère le token JWT du cookie
- **Vérifie** que le token est valide en utilisant le `JWT_SECRET`
- Si le token est valide, l'utilisateur est authentifié
- Si le token est invalide ou modifié, l'accès est refusé

## 🔒 Pourquoi c'est important ?

Sans un `JWT_SECRET` sécurisé :
- ❌ N'importe qui pourrait créer de faux tokens
- ❌ N'importe qui pourrait se faire passer pour un autre utilisateur
- ❌ Votre application serait vulnérable aux attaques

Avec un `JWT_SECRET` sécurisé :
- ✅ Seul votre serveur peut créer des tokens valides
- ✅ Les tokens ne peuvent pas être falsifiés
- ✅ Votre application est sécurisée

## 🛠️ Comment générer un JWT_SECRET ?

### Méthode 1 : Script automatique (recommandé)

```bash
cd apps/backend
npm run generate:secret
```

Ce script génère un secret aléatoire de 64 caractères (128 en hexadécimal).

### Méthode 2 : Ligne de commande Node.js

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Méthode 3 : OpenSSL

```bash
openssl rand -hex 64
```

### Méthode 4 : En ligne (générateurs en ligne)

Vous pouvez utiliser des générateurs en ligne, mais **attention** : ne générez jamais de secrets de production en ligne !

## 📝 Comment l'utiliser ?

1. **Générez un secret** avec une des méthodes ci-dessus

2. **Ajoutez-le dans votre fichier `.env`** :
   ```env
   JWT_SECRET=votre_secret_genere_ici_64_caracteres_minimum
   ```

3. **Redémarrez votre serveur** pour que les changements prennent effet

## ⚠️ Règles de sécurité IMPORTANTES

### ✅ À FAIRE :
- ✅ Utilisez un secret **unique** et **aléatoire**
- ✅ Minimum **32 caractères** (64 recommandé)
- ✅ Utilisez un secret **différent** pour chaque environnement :
  - Développement : `JWT_SECRET_DEV`
  - Staging : `JWT_SECRET_STAGING`
  - Production : `JWT_SECRET_PROD`
- ✅ Stockez-le dans un **gestionnaire de mots de passe**
- ✅ Utilisez des **variables d'environnement** (fichier `.env`)

### ❌ À NE JAMAIS FAIRE :
- ❌ **NE JAMAIS** commiter le secret dans Git
- ❌ **NE JAMAIS** partager le secret publiquement
- ❌ **NE JAMAIS** utiliser le même secret en dev et production
- ❌ **NE JAMAIS** utiliser des secrets faibles comme "secret123"
- ❌ **NE JAMAIS** stocker le secret dans le code source

## 🔍 Où trouver votre JWT_SECRET actuel ?

Votre `JWT_SECRET` se trouve dans le fichier `.env` de votre backend :

```
apps/backend/.env
```

Pour le voir :
```bash
cd apps/backend
cat .env | grep JWT_SECRET
```

## 🔄 Que faire si votre secret est compromis ?

Si vous pensez que votre `JWT_SECRET` a été compromis :

1. **Générez un nouveau secret** immédiatement
2. **Remplacez-le** dans votre fichier `.env`
3. **Redémarrez** votre serveur
4. **Tous les utilisateurs devront se reconnecter** (leurs anciens tokens seront invalides)

---

## 🔄 Quand régénérer un JWT_SECRET ?

### ⚠️ Situations où vous DEVEZ régénérer immédiatement

#### 1. **Compromission de sécurité** 🔴 CRITIQUE

**Quand :** Si vous pensez que votre `JWT_SECRET` a été exposé ou volé.

**Signes d'alerte :**
- Le secret a été committé dans Git (même si vous l'avez supprimé après)
- Le secret a été partagé publiquement (email, chat, etc.)
- Un accès non autorisé à votre serveur/environnement
- Des tokens JWT valides sont générés par des personnes non autorisées
- Suspicion de fuite de données

**Action immédiate :**
1. Régénérer un nouveau secret **immédiatement**
2. Mettre à jour le `.env` sur tous les environnements
3. Redémarrer tous les serveurs
4. **Tous les utilisateurs devront se reconnecter** (leurs anciens tokens seront invalides)

#### 2. **Changement d'environnement** 🟡 IMPORTANT

**Quand :** Vous créez un nouvel environnement (staging, production, etc.)

**Pourquoi :**
- Chaque environnement doit avoir son propre secret
- Évite que les tokens de dev fonctionnent en production
- Sécurité et isolation des environnements

**Action :**
- Générer un secret unique pour chaque environnement
- Ne jamais réutiliser le même secret entre environnements

#### 3. **Rotation de sécurité périodique** 🟡 RECOMMANDÉ

**Quand :** Rotation préventive (bonne pratique de sécurité)

**Fréquence recommandée :**
- **Production :** Tous les 3-6 mois (selon votre politique de sécurité)
- **Staging :** Tous les 6-12 mois
- **Développement :** Moins critique, mais possible

**Avantages :**
- Limite l'impact d'une éventuelle compromission
- Bonne pratique de sécurité (defense in depth)
- Conforme aux standards de sécurité

**Inconvénient :**
- Tous les utilisateurs devront se reconnecter

### ✅ Situations où vous NE DEVEZ PAS régénérer

#### 1. **Changement de serveur/hébergement** ❌

**Quand :** Vous déplacez votre application vers un nouveau serveur

**Pourquoi ne pas régénérer :**
- Les utilisateurs ont des tokens valides
- Si vous régénérez, tous les utilisateurs seront déconnectés
- Pas de raison de sécurité

**Action :**
- Copier le même `JWT_SECRET` vers le nouveau serveur
- Assurez-vous qu'il est bien dans le `.env` du nouveau serveur

#### 2. **Redémarrage du serveur** ❌

**Quand :** Vous redémarrez votre serveur

**Pourquoi ne pas régénérer :**
- Le secret est lu depuis le `.env` à chaque démarrage
- Pas besoin de changer

**Action :**
- Aucune action nécessaire
- Le serveur utilise le secret existant

#### 3. **Mise à jour de dépendances** ❌

**Quand :** Vous mettez à jour les packages npm

**Pourquoi ne pas régénérer :**
- Aucun impact sur le JWT_SECRET
- Pas de raison de sécurité

**Action :**
- Aucune action nécessaire

#### 4. **Ajout de nouvelles fonctionnalités** ❌

**Quand :** Vous ajoutez de nouvelles routes ou fonctionnalités

**Pourquoi ne pas régénérer :**
- Le secret n'a pas changé
- Pas de raison de sécurité

**Action :**
- Aucune action nécessaire

## 🔍 Comment détecter si votre secret est compromis ?

### Signes à surveiller :

1. **Tokens invalides générés par des tiers**
   - Des utilisateurs se connectent sans avoir créé de compte
   - Des tokens valides apparaissent dans les logs sans correspondre à vos utilisateurs

2. **Accès non autorisé**
   - Des actions effectuées par des utilisateurs qui ne devraient pas y avoir accès
   - Des publications créées par des utilisateurs inconnus

3. **Logs suspects**
   - Des tentatives de connexion avec des tokens invalides mais bien formés
   - Des erreurs d'authentification inexpliquées

### Vérification :

```bash
# Vérifier si votre secret est dans Git (même dans l'historique)
git log --all --full-history --source -- "*env*" | grep JWT_SECRET

# Vérifier les fichiers .env dans le repo
find . -name ".env" -type f
```

## 📋 Checklist : Dois-je régénérer ?

Cochez les cases qui s'appliquent :

- [ ] Le secret a été committé dans Git
- [ ] Le secret a été partagé publiquement
- [ ] Suspicion de compromission
- [ ] Création d'un nouvel environnement
- [ ] Rotation de sécurité périodique (3-6 mois en prod)
- [ ] Migration vers un nouveau serveur (copier, ne pas régénérer)
- [ ] Redémarrage du serveur (ne pas régénérer)
- [ ] Mise à jour de code (ne pas régénérer)

**Si vous avez coché une des 5 premières cases → RÉGÉNÉREZ**
**Si vous avez coché une des 3 dernières cases → NE RÉGÉNÉREZ PAS**

## 🛠️ Procédure de régénération

Si vous devez régénérer :

1. **Générer un nouveau secret :**
   ```bash
   cd apps/backend
   npm run generate:secret
   ```

2. **Mettre à jour le `.env` :**
   ```env
   JWT_SECRET=votre_nouveau_secret_ici
   ```

3. **Redémarrer le serveur :**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Puis redémarrer
   npm run dev
   ```

4. **Informer les utilisateurs :**
   - Tous les utilisateurs devront se reconnecter
   - Leurs anciens tokens seront invalides
   - Pas d'impact sur les données, seulement sur les sessions

## 💡 Bonnes pratiques

1. **Ne jamais commiter le secret** dans Git
2. **Utiliser un secret différent** par environnement
3. **Stocker le secret** dans un gestionnaire de mots de passe sécurisé
4. **Documenter** où se trouve le secret pour chaque environnement
5. **Rotation périodique** en production (3-6 mois)
6. **Surveiller** les accès et les logs pour détecter les compromissions

## 📚 Ressources

- [JWT.io](https://jwt.io/) - Documentation sur les JWT
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

