# Erreur : unauthorized_scope_error

## 🔴 Symptôme

Quand vous cliquez sur "LinkedIn", vous êtes redirigé vers le dashboard avec l'erreur :
```
linkedin_error=unauthorized_scope_error
```

## 🔍 Cause

LinkedIn refuse les permissions (scopes) demandées, notamment :
- `r_organization_social` - Pour lire les pages d'entreprise
- `w_organization_social` - Pour publier sur pages d'entreprise

Ces permissions nécessitent que :
1. Le produit **"Share on LinkedIn"** soit **approuvé** dans LinkedIn Developers
2. Votre application ait demandé et obtenu l'accès à ces permissions

## ✅ Solutions

### Solution 1 : Approuver "Share on LinkedIn" (Recommandé)

1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Sélectionnez votre application
3. Allez dans l'onglet **Products**
4. Trouvez **"Share on LinkedIn"**
5. Si le statut est **"Request access"** ou **"Pending"** :
   - Cliquez sur **"Request access"**
   - Remplissez le formulaire de demande
   - **Attendez l'approbation** (peut prendre quelques heures à quelques jours)
6. Une fois approuvé, le statut passera à **"Approved"**

⚠️ **IMPORTANT** : Sans cette approbation, vous ne pouvez pas utiliser les permissions `r_organization_social` et `w_organization_social`.

### Solution 2 : Utiliser uniquement le profil personnel (Temporaire)

Si vous voulez tester rapidement sans attendre l'approbation, vous pouvez modifier temporairement le code pour utiliser uniquement les permissions de base (profil personnel).

**Note** : Le code a été mis à jour pour gérer cela automatiquement. Si les permissions organization ne sont pas disponibles, il utilisera le profil personnel.

### Solution 3 : Vérifier les permissions de votre compte

Pour publier sur une page d'entreprise, vous devez aussi :

1. **Être administrateur** de la page Webysta sur LinkedIn
   - Allez sur votre page LinkedIn Webysta
   - Vérifiez que vous avez le rôle **Super admin** ou **Content admin**

2. **Vérifier que la page est active**
   - La page doit être publique et active
   - Pas de restrictions d'accès

### Solution 4 : Vérifier la configuration de l'application

Dans LinkedIn Developers, onglet **Auth** :

1. Vérifiez que **"Sign In with LinkedIn using OpenID Connect"** est activé
2. Vérifiez que les **Redirect URLs** sont correctement configurées
3. Vérifiez que votre **Client ID** et **Client Secret** sont corrects

## 🔄 Processus d'approbation LinkedIn

Quand vous demandez l'accès à "Share on LinkedIn" :

1. **Soumission** : Vous remplissez un formulaire expliquant l'usage de l'API
2. **Révision** : LinkedIn examine votre demande (1-3 jours ouvrables)
3. **Approbation/Refus** : Vous recevez un email avec la décision

**Conseils pour l'approbation** :
- Expliquez clairement que vous voulez publier sur une page d'entreprise
- Mentionnez que vous êtes administrateur de la page
- Décrivez l'usage prévu (publication automatique de contenu)

## 📝 Vérification rapide

Pour vérifier si vos permissions sont approuvées :

1. Allez sur [LinkedIn Developers > Your App > Products](https://www.linkedin.com/developers/apps)
2. Regardez le statut de **"Share on LinkedIn"** :
   - ✅ **Approved** = Vous pouvez utiliser les permissions organization
   - ⏳ **Pending** = En attente d'approbation
   - ❌ **Not requested** = Vous devez demander l'accès

## 🚀 Une fois approuvé

Une fois que "Share on LinkedIn" est approuvé :

1. **Redémarrez votre serveur backend**
2. **Déconnectez-vous de LinkedIn** dans votre navigateur (ou utilisez navigation privée)
3. **Reconnectez-vous** depuis votre application
4. Vous devriez voir la page d'autorisation LinkedIn avec toutes les permissions

## ⚠️ Note importante

Si vous n'avez pas encore l'approbation pour les permissions organization, l'application fonctionnera quand même mais :
- ✅ Vous pourrez publier sur votre **profil personnel** LinkedIn
- ❌ Vous ne pourrez **pas** publier sur la page d'entreprise Webysta

Une fois l'approbation obtenue, reconnectez-vous pour activer la publication sur les pages d'entreprise.

