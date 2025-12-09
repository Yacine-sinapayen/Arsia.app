# Comment vérifier le statut d'approbation de "Share on LinkedIn"

## 📍 Où trouver le statut

Sur la capture d'écran, vous voyez les produits dans "Added products", mais le **statut d'approbation** n'est pas visible ici.

### Méthode 1 : Cliquer sur "Share on LinkedIn"

1. Cliquez directement sur **"Share on LinkedIn"** dans la liste
2. Vous devriez voir une page de détails avec :
   - Le statut (Approved, Pending, Request access, etc.)
   - La date de demande
   - La date d'approbation (si approuvé)
   - Les permissions incluses

### Méthode 2 : Vérifier dans l'onglet "Auth"

1. Allez dans l'onglet **"Auth"** (à gauche)
2. Regardez la section **"OAuth 2.0 settings"**
3. Vous devriez voir les scopes disponibles et leur statut

### Méthode 3 : Vérifier les permissions dans l'URL OAuth

Quand vous essayez de vous connecter, si LinkedIn renvoie :
- ✅ **Pas d'erreur** → Les scopes sont approuvés
- ❌ **`unauthorized_scope_error`** → Les scopes ne sont pas encore approuvés

## 🔍 Ce que signifie "Added products"

"Added products" signifie que vous avez **ajouté** le produit à votre application, mais cela ne garantit pas qu'il est **approuvé**.

### Différence entre "Added" et "Approved"

- **Added** : Le produit est dans votre liste, mais peut être en attente d'approbation
- **Approved** : Le produit est approuvé et vous pouvez utiliser toutes ses permissions

## ⚠️ Si "Share on LinkedIn" n'est pas encore approuvé

Si le statut est **"Pending"** ou **"Request access"** :

1. **Si "Pending"** : Attendez l'approbation (1-3 jours ouvrables)
2. **Si "Request access"** : Cliquez dessus et remplissez le formulaire

En attendant, utilisez `LINKEDIN_USE_ORGANIZATION_SCOPES=false` dans votre `.env` pour tester avec le profil personnel.

## ✅ Une fois approuvé

Quand le statut passe à **"Approved"** :

1. Retirez `LINKEDIN_USE_ORGANIZATION_SCOPES=false` de votre `.env`
2. Redémarrez le serveur backend
3. Reconnectez-vous à LinkedIn
4. Les scopes organization seront alors disponibles





