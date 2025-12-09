# 🚨 Solution rapide : Erreur MongoDB `querySrv ECONNREFUSED`

## 🔍 Diagnostic

Votre erreur indique que le DNS ne peut pas résoudre le nom de domaine MongoDB Atlas. Cela signifie probablement que :

1. **Le cluster MongoDB Atlas a été supprimé ou renommé**
2. **L'URI dans votre `.env` est incorrecte ou obsolète**

## ✅ Solution : Autoriser votre IP dans MongoDB Atlas

### ⚠️ CAUSE LA PLUS FRÉQUENTE : IP non autorisée

**Dans 90% des cas, le problème vient du fait que votre IP n'est pas autorisée dans MongoDB Atlas.**

### Étape 1 : Autoriser votre IP (PRIORITÉ)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Connectez-vous à votre compte
3. Cliquez sur **"Network Access"** dans le menu de gauche
4. Cliquez sur **"Add IP Address"**
5. Vous avez deux options :
   - **Option A (Recommandé pour dev)** : Cliquez sur **"Add Current IP Address"** pour ajouter automatiquement votre IP
   - **Option B (Développement uniquement)** : Entrez `0.0.0.0/0` pour autoriser toutes les IPs
     ⚠️ **Attention : Ne faites cela qu'en développement, jamais en production !**
6. Cliquez sur **"Confirm"**
7. Attendez quelques secondes que l'IP soit ajoutée

### Étape 2 : Vérifier votre cluster MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Connectez-vous à votre compte
3. Vérifiez que votre cluster existe toujours
4. Si le cluster n'existe plus, créez-en un nouveau

### Étape 2 : Obtenir la nouvelle URI

1. Dans MongoDB Atlas, cliquez sur **"Connect"** à côté de votre cluster
2. Sélectionnez **"Connect your application"**
3. Choisissez **"Node.js"** comme driver
4. Copiez la **Connection String** qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Étape 3 : Mettre à jour votre `.env`

1. Ouvrez `apps/backend/.env`
2. Remplacez la ligne `MONGODB_URI` par :
   ```env
   MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/iartisan?retryWrites=true&w=majority
   ```
   
   **Important :**
   - Remplacez `<username>` et `<password>` par vos identifiants
   - Remplacez `cluster0.xxxxx.mongodb.net` par votre cluster
   - Ajoutez `/iartisan` avant le `?` pour spécifier le nom de la base de données

### Étape 4 : Vérifier l'IP autorisée

1. Dans MongoDB Atlas, allez dans **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Pour le développement, vous pouvez ajouter `0.0.0.0/0` (autorise toutes les IPs)
   ⚠️ **Attention : Ne faites cela qu'en développement !**

### Étape 5 : Tester la connexion

```bash
cd apps/backend
npm run test:db
```

Si ça fonctionne, vous devriez voir :
```
✅ Connexion MongoDB réussie !
```

### Étape 6 : Redémarrer le serveur

```bash
cd apps/backend
npm run dev
```

## 🔄 Si vous devez créer un nouveau cluster

1. MongoDB Atlas → **"Create"** → **"Cluster"**
2. Choisissez le type de cluster (gratuit disponible)
3. Sélectionnez la région
4. Créez le cluster (peut prendre quelques minutes)
5. Suivez les étapes 2-6 ci-dessus

## 💡 Alternative : Utiliser MongoDB local

Si vous préférez utiliser MongoDB localement :

1. Installez MongoDB :
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. Mettez à jour votre `.env` :
   ```env
   MONGODB_URI=mongodb://localhost:27017/iartisan
   ```

3. Redémarrez le serveur

