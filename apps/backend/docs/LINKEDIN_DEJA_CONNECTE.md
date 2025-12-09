# Problème : Déjà connecté à LinkedIn

## 🔴 Symptôme

Quand vous cliquez sur "LinkedIn", vous êtes redirigé vers `https://www.linkedin.com/li/track` au lieu de voir la page d'autorisation ou d'être redirigé vers votre callback.

## 🔍 Cause

Si vous êtes **déjà connecté à LinkedIn** dans votre navigateur et que l'application a **déjà été autorisée**, LinkedIn peut :
- Réutiliser une session existante
- Rediriger vers une page de tracking au lieu de demander une nouvelle autorisation
- Ne pas déclencher le callback correctement

## ✅ Solutions

### Solution 1 : Forcer une nouvelle autorisation (Recommandé)

Le code a été mis à jour pour inclure `prompt=consent` dans l'URL d'autorisation. Cela force LinkedIn à demander une nouvelle autorisation même si vous êtes déjà connecté.

**Si ça ne fonctionne toujours pas**, essayez les solutions suivantes :

### Solution 2 : Se déconnecter de LinkedIn

1. Allez sur [linkedin.com](https://www.linkedin.com)
2. Cliquez sur votre photo de profil (en haut à droite)
3. Cliquez sur **"Se déconnecter"**
4. Retournez sur votre application et cliquez à nouveau sur "LinkedIn"
5. Connectez-vous et autorisez l'application

### Solution 3 : Révoquer les autorisations existantes

1. Allez sur [LinkedIn Settings > Security > Third-party applications](https://www.linkedin.com/psettings/manage-applications)
2. Trouvez votre application "Arsia" (ou le nom que vous avez donné)
3. Cliquez sur **"Remove"** ou **"Révoquer"**
4. Retournez sur votre application et reconnectez-vous

### Solution 4 : Utiliser un navigateur en navigation privée

1. Ouvrez une fenêtre de navigation privée (Incognito)
2. Allez sur votre application
3. Connectez-vous à votre compte
4. Cliquez sur "LinkedIn"
5. Vous devriez voir la page d'autorisation LinkedIn

### Solution 5 : Vider le cache et les cookies LinkedIn

1. Ouvrez les paramètres de votre navigateur
2. Allez dans "Cookies et données de sites"
3. Recherchez "linkedin.com"
4. Supprimez tous les cookies LinkedIn
5. Rechargez la page et réessayez

## 🔍 Vérification

Pour vérifier si c'est bien le problème :

1. **Ouvrez une fenêtre de navigation privée**
2. Allez sur votre application
3. Connectez-vous
4. Cliquez sur "LinkedIn"

Si ça fonctionne en navigation privée, c'est bien un problème de session/cache LinkedIn existante.

## 📝 Note technique

Le paramètre `prompt=consent` dans l'URL OAuth force LinkedIn à :
- Afficher la page d'autorisation même si déjà autorisé
- Demander une nouvelle confirmation
- Générer un nouveau code d'autorisation

Cela devrait résoudre le problème dans la plupart des cas.

