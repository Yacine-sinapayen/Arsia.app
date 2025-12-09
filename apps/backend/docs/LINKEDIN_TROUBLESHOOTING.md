# Dépannage LinkedIn - Erreur de redirection

## 🔴 Problème : Redirection vers `/li/track` au lieu du callback

Si LinkedIn vous redirige vers `https://www.linkedin.com/li/track` au lieu de votre callback, cela signifie que LinkedIn n'accepte pas votre URL de redirection.

## ✅ Solutions

### 1. Vérifier l'URL de redirection dans LinkedIn Developers

1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Sélectionnez votre application
3. Allez dans l'onglet **Auth**
4. Dans la section **Redirect URLs**, vérifiez que vous avez exactement :
   ```
   http://localhost:4000/api/linkedin/callback
   ```
   
   ⚠️ **IMPORTANT** :
   - Pas d'espace avant/après
   - Pas de slash final (`/`)
   - Exactement la même URL que dans votre `.env`

### 2. Vérifier votre fichier `.env`

Dans `apps/backend/.env`, vous devez avoir :

```env
LINKEDIN_CLIENT_ID=votre_client_id_ici
LINKEDIN_CLIENT_SECRET=votre_client_secret_ici
LINKEDIN_REDIRECT_URI=http://localhost:4000/api/linkedin/callback
```

⚠️ **Vérifiez** :
- Pas d'espaces autour du `=`
- Pas de guillemets autour des valeurs
- URL exactement identique à celle dans LinkedIn Developers

### 3. Vérifier les permissions de l'application

Dans LinkedIn Developers, onglet **Products** :

1. ✅ **Sign In with LinkedIn using OpenID Connect** doit être activé
2. ✅ **Share on LinkedIn** doit être activé et **approuvé**

Si un produit n'est pas approuvé :
- Cliquez sur "Request access"
- Attendez l'approbation (peut prendre quelques heures)

### 4. Vérifier les logs du serveur

Quand vous cliquez sur "LinkedIn", regardez les logs du serveur backend. Vous devriez voir :

```
🔗 LinkedIn Configuration:
  - Client ID: ✅ Défini
  - Redirect URI: http://localhost:4000/api/linkedin/callback
  - Scopes: openid profile email w_member_social r_organization_social w_organization_social
  - Auth URL générée: https://www.linkedin.com/oauth/v2/authorization?...
```

Si vous voyez "❌ Manquant" pour Client ID, vérifiez votre `.env`.

### 5. Tester l'URL générée

1. Cliquez sur "LinkedIn" dans le Dashboard
2. Ouvrez la console du navigateur (F12)
3. Regardez la requête vers `/api/linkedin/auth`
4. Copiez l'`authUrl` de la réponse
5. Collez-la dans un nouvel onglet

Vous devriez voir la page d'autorisation LinkedIn. Si vous voyez une erreur, LinkedIn vous dira exactement quel est le problème.

### 6. Erreurs courantes

#### "redirect_uri does not match"
- L'URL dans LinkedIn Developers ne correspond pas exactement à celle dans `.env`
- Vérifiez qu'il n'y a pas de différence (http vs https, port, chemin, slash final)

#### "Invalid client_id"
- Le `LINKEDIN_CLIENT_ID` dans `.env` est incorrect
- Vérifiez que vous avez copié le bon Client ID depuis LinkedIn Developers

#### "Invalid scope"
- Les permissions demandées ne sont pas approuvées dans votre application
- Vérifiez que les produits sont approuvés dans LinkedIn Developers

### 7. Pour la production

Quand vous déployez en production, vous devez :

1. Ajouter l'URL de production dans LinkedIn Developers :
   ```
   https://votre-domaine.com/api/linkedin/callback
   ```

2. Mettre à jour `.env` :
   ```env
   LINKEDIN_REDIRECT_URI=https://votre-domaine.com/api/linkedin/callback
   ```

3. Redémarrer le serveur backend

## 🔍 Vérification rapide

Exécutez cette commande pour vérifier vos variables d'environnement :

```bash
cd apps/backend
node -e "require('dotenv').config(); console.log('Client ID:', process.env.LINKEDIN_CLIENT_ID ? '✅' : '❌'); console.log('Client Secret:', process.env.LINKEDIN_CLIENT_SECRET ? '✅' : '❌'); console.log('Redirect URI:', process.env.LINKEDIN_REDIRECT_URI);"
```

Tous doivent être ✅ et l'URL doit correspondre exactement à celle dans LinkedIn Developers.

