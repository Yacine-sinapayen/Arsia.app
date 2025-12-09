# 🔧 Dépannage : Erreur de connexion MongoDB

## ❌ Erreur : `querySrv ECONNREFUSED` ou `Unknown host`

Cette erreur indique que votre application ne peut pas se connecter à MongoDB Atlas.

### 🔴 Problème détecté : Résolution DNS échouée

Si vous voyez `Unknown host` ou `Can't find cluster0.vguh8oy.mongodb.net`, cela signifie que :
- ✅ Votre connexion internet fonctionne
- ❌ Le DNS ne peut pas résoudre le nom de domaine MongoDB Atlas

**Causes possibles :**
1. Le cluster MongoDB Atlas a été supprimé ou renommé
2. Problème temporaire avec le DNS
3. L'URI MongoDB dans votre `.env` est incorrecte ou obsolète

### 🔍 Causes possibles

1. **Problème de connexion internet**
2. **Problème de résolution DNS** (querySrv)
3. **Firewall ou restrictions réseau**
4. **MongoDB Atlas temporairement inaccessible**
5. **IP non autorisée dans MongoDB Atlas**

### ✅ Solutions à essayer

#### 1. Vérifier votre connexion internet

```bash
# Tester la connexion
ping google.com

# Tester la résolution DNS
nslookup cluster0.vguh8oy.mongodb.net
```

#### 2. Vérifier votre IP dans MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Connectez-vous à votre compte
3. Sélectionnez votre cluster
4. Cliquez sur **"Network Access"** dans le menu de gauche
5. Vérifiez que votre IP actuelle est autorisée
6. Si non, cliquez sur **"Add IP Address"** et ajoutez :
   - Votre IP actuelle (ou `0.0.0.0/0` pour autoriser toutes les IPs - **uniquement en développement**)

#### 3. Vérifier votre URI MongoDB

Votre URI doit être au format :
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Vérifiez dans `apps/backend/.env` :
```bash
cd apps/backend
cat .env | grep MONGODB_URI
```

#### 4. Tester la connexion manuellement

```bash
# Installer mongosh si nécessaire
brew install mongosh

# Tester la connexion
mongosh "votre_uri_mongodb"
```

#### 5. Vérifier les paramètres de réseau

Si vous êtes derrière un VPN ou un proxy :
- Essayez de désactiver temporairement le VPN
- Vérifiez les paramètres de proxy

#### 6. Vérifier que MongoDB Atlas est en ligne

1. Allez sur [MongoDB Atlas Status](https://status.mongodb.com/)
2. Vérifiez qu'il n'y a pas d'incident en cours

#### 7. Utiliser une connexion alternative

Si `mongodb+srv://` ne fonctionne pas, essayez avec l'URI standard :

1. Dans MongoDB Atlas, cliquez sur **"Connect"**
2. Sélectionnez **"Connect your application"**
3. Choisissez **"Standard connection string"** au lieu de **"Connection string"**
4. Copiez l'URI et remplacez dans votre `.env`

### 🔄 Redémarrer le serveur

Après avoir modifié les paramètres :

```bash
cd apps/backend
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### 📝 Vérifier les logs

Les logs améliorés vous donneront plus d'informations :

```
🔄 Connecting to MongoDB...
❌ Error connecting to MongoDB:
   Message: querySrv ECONNREFUSED...
```

### 💡 Solution rapide : Autoriser toutes les IPs (DEV ONLY)

⚠️ **ATTENTION : Ne faites cela qu'en développement !**

1. MongoDB Atlas → Network Access
2. Cliquez sur **"Add IP Address"**
3. Entrez `0.0.0.0/0`
4. Cliquez sur **"Confirm"**

Cela autorisera toutes les IPs à se connecter (dangereux en production).

### 🆘 Si rien ne fonctionne

1. Vérifiez que votre compte MongoDB Atlas est actif
2. Vérifiez que vous avez des crédits disponibles
3. Contactez le support MongoDB Atlas
4. Essayez de créer un nouveau cluster

