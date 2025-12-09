# 📱 Problème MongoDB avec partage de connexion

## 🔍 Problème identifié

Quand vous utilisez le **partage de connexion** (hotspot) de votre téléphone, votre **IP publique change**. MongoDB Atlas bloque les connexions depuis des IPs non autorisées, d'où l'erreur `querySrv ECONNREFUSED`.

## ✅ Solutions

### Solution 1 : Autoriser toutes les IPs (Recommandé pour développement) ⭐

**⚠️ ATTENTION : Ne faites cela qu'en développement, jamais en production !**

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Cliquez sur **"Network Access"** dans le menu de gauche
3. Cliquez sur **"Add IP Address"**
4. Entrez `0.0.0.0/0` (autorise toutes les IPs)
5. Cliquez sur **"Confirm"**
6. Attendez 1-2 minutes pour la propagation

**Avantages :**
- ✅ Fonctionne avec n'importe quelle connexion (WiFi, partage de connexion, etc.)
- ✅ Pas besoin de mettre à jour l'IP à chaque changement de réseau
- ✅ Idéal pour le développement

**Inconvénients :**
- ❌ Moins sécurisé (mais acceptable en développement)
- ❌ Ne jamais utiliser en production

### Solution 2 : Ajouter les deux IPs

Si vous voulez être plus sécurisé, ajoutez les deux IPs :

1. **Récupérez votre IP WiFi :**
   ```bash
   # Connecté en WiFi
   curl -4 ifconfig.me
   ```

2. **Récupérez votre IP partage de connexion :**
   ```bash
   # Connecté en partage de connexion
   curl -4 ifconfig.me
   ```

3. **Ajoutez les deux IPs dans MongoDB Atlas :**
   - MongoDB Atlas → Network Access → Add IP Address
   - Ajoutez chaque IP une par une

**Avantages :**
- ✅ Plus sécurisé
- ✅ Fonctionne avec vos deux connexions principales

**Inconvénients :**
- ❌ Il faut mettre à jour si vous changez de réseau
- ❌ Plus de maintenance

### Solution 3 : Script pour récupérer et afficher votre IP

Créez un script pour voir rapidement votre IP actuelle :

```bash
# Créer un script
echo '#!/bin/bash
echo "Votre IP publique actuelle :"
curl -4 ifconfig.me
echo ""
echo "Pour l\'ajouter dans MongoDB Atlas :"
echo "1. MongoDB Atlas → Network Access"
echo "2. Add IP Address"
echo "3. Collez l\'IP ci-dessus"' > ~/get-ip.sh

chmod +x ~/get-ip.sh
```

Puis utilisez :
```bash
~/get-ip.sh
```

## 🔄 Workflow recommandé pour le développement

1. **Autorisez `0.0.0.0/0` dans MongoDB Atlas** (développement uniquement)
2. Vous pouvez maintenant utiliser n'importe quelle connexion
3. **En production**, utilisez uniquement des IPs spécifiques

## 📝 Note importante

- Chaque fois que vous changez de réseau (WiFi → partage de connexion, ou vice versa), votre IP publique change
- MongoDB Atlas bloque les connexions depuis des IPs non autorisées
- C'est une fonctionnalité de sécurité de MongoDB Atlas

## 🚀 Solution rapide

Pour le développement, la solution la plus simple est d'autoriser toutes les IPs :

```
MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0
```

Cela résoudra le problème pour toutes vos connexions en développement.

