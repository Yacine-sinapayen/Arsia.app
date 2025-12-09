# ✅ Vérification : IP autorisée dans MongoDB Atlas

## 🔍 Vérifier que votre IP est bien autorisée

### 1. Trouver votre IP actuelle

Votre IP publique est : (voir ci-dessous)

### 2. Vérifier dans MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Cliquez sur **"Network Access"** dans le menu de gauche
3. Vérifiez que votre IP apparaît dans la liste
4. Si elle n'y est pas, ajoutez-la :
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Add Current IP Address"** (plus simple)
   - Ou entrez manuellement votre IP
   - Cliquez sur **"Confirm"**

### 3. Attendre la propagation

Après avoir ajouté l'IP, attendez **1-2 minutes** pour que les changements soient propagés.

### 4. Redémarrer le serveur

```bash
cd apps/backend
# Arrêter le serveur (Ctrl+C si en cours)
npm run dev
```

### 5. Tester la connexion

```bash
cd apps/backend
npm run test:db
```

## 💡 Si ça ne fonctionne toujours pas

1. **Vérifiez que vous êtes bien connecté au bon compte MongoDB Atlas**
2. **Vérifiez que le cluster existe toujours**
3. **Essayez d'ajouter `0.0.0.0/0` temporairement** (uniquement pour tester en dev)
4. **Vérifiez votre connexion internet**
5. **Essayez de redémarrer votre routeur/box internet**

