# 🔍 Comment vérifier les utilisateurs en base de données

## Méthode 1 : Script de liste (Recommandé) ⭐

### Lister tous les utilisateurs

```bash
cd apps/backend
npm run list:users
```

Affiche :
- Le nombre total d'utilisateurs
- L'ID de chaque utilisateur
- L'email de chaque utilisateur
- La date de création

### Rechercher un utilisateur spécifique

```bash
cd apps/backend
npm run find:user -- email@example.com
```

Affiche :
- Les informations de l'utilisateur
- Le nombre de publications
- Les détails des publications

### Lister tous les utilisateurs avec détails

```bash
cd apps/backend
npm run find:user
```

Affiche tous les utilisateurs avec leurs publications.

## Méthode 2 : Via MongoDB Compass (Interface graphique)

Si vous utilisez MongoDB Atlas ou avez MongoDB Compass installé :

1. **Ouvrez MongoDB Compass**
2. **Connectez-vous** avec votre URI MongoDB :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/
   ```
3. **Sélectionnez la base de données** (par défaut : `test` ou celle spécifiée dans votre URI)
4. **Ouvrez la collection** `users`
5. **Visualisez** tous les documents utilisateurs

## Méthode 3 : Via MongoDB Shell (mongo/mongosh)

Si vous avez MongoDB Shell installé :

```bash
# Se connecter à MongoDB
mongosh "votre_uri_mongodb"

# Dans le shell MongoDB :
use test  # ou le nom de votre base de données
db.users.find().pretty()

# Rechercher un utilisateur spécifique
db.users.findOne({ email: "email@example.com" })

# Compter les utilisateurs
db.users.countDocuments()
```

## Méthode 4 : Via l'API (pour le développement uniquement)

⚠️ **Attention** : Ne créez jamais une route publique pour lister les utilisateurs en production !

Pour le développement, vous pouvez temporairement ajouter une route dans `src/routes/auth.js` :

```javascript
// GET /api/auth/users (DEV ONLY - À supprimer en production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').lean();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});
```

Puis tester avec :
```bash
curl http://localhost:4000/api/auth/users
```

## Méthode 5 : Via les logs du serveur

Quand un utilisateur s'inscrit, le serveur affiche dans les logs :
```
User created: { id: '...', email: '...' }
```

## 📊 Résumé des commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run list:users` | Liste tous les utilisateurs |
| `npm run find:user` | Liste tous les utilisateurs avec détails |
| `npm run find:user -- email@example.com` | Recherche un utilisateur spécifique |
| `npm run test:auth` | Teste l'authentification (crée un utilisateur de test) |

## 🔒 Sécurité

- ✅ Les scripts de liste sont **sûrs** : ils ne modifient pas les données
- ✅ Les mots de passe sont **jamais affichés** (seul le hash est stocké)
- ❌ Ne créez **jamais** de route publique pour lister les utilisateurs en production
- ❌ Ne commitez **jamais** vos identifiants MongoDB dans Git

## 💡 Astuce

Pour vérifier rapidement qu'un utilisateur a été créé après une inscription :

```bash
# Après avoir créé un compte via l'interface web
npm run find:user -- l_email_utilise@example.com
```

