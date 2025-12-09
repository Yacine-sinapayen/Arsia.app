# LinkedIn API `/rest/posts` vs `/v2/ugcPosts`

## 📊 Comparaison des deux APIs

### API actuelle : `/v2/ugcPosts`
- **Endpoint** : `https://api.linkedin.com/v2/ugcPosts`
- **Format** : UGC (User Generated Content) - format complexe mais flexible
- **Support images** : Oui, via upload d'assets séparé
- **Permissions** : Nécessite `w_organization_social` pour pages d'entreprise

### Nouvelle API : `/rest/posts`
- **Endpoint** : `https://api.linkedin.com/rest/posts`
- **Format** : REST API simplifiée
- **Support images** : À vérifier (peut nécessiter un format différent)
- **Permissions** : Nécessite toujours `w_organization_social` pour pages d'entreprise

## ⚠️ Point important

**Les deux APIs nécessitent les mêmes permissions** :
- `w_member_social` pour profil personnel
- `w_organization_social` pour pages d'entreprise

Le problème actuel (`unauthorized_scope_error`) ne sera **pas résolu** en changeant d'API. Il faut toujours attendre l'approbation de "Share on LinkedIn".

## 🔄 Migration possible

Une fois les permissions approuvées, on peut migrer vers `/rest/posts` si :
1. L'API supporte les images de la même manière
2. L'API est plus stable/maintenue
3. Le format est plus simple à maintenir

## 📝 Format `/rest/posts`

```json
{
  "author": "urn:li:organization:123456789",
  "commentary": "Follow best practices #coding",
  "visibility": "PUBLIC",
  "distribution": {
    "feedDistribution": "MAIN_FEED",
    "targetEntities": [],
    "thirdPartyDistributionChannels": []
  },
  "lifecycleState": "PUBLISHED",
  "isReshareDisabledByAuthor": false
}
```

**Note** : Ce format ne montre pas comment ajouter une image. Il faudra vérifier la documentation LinkedIn pour voir comment gérer les médias.

## ✅ Recommandation

Pour l'instant, **gardons `/v2/ugcPosts`** car :
1. Il fonctionne avec les images
2. Il est bien documenté
3. Le problème n'est pas l'API mais les permissions

Une fois les permissions approuvées, on pourra évaluer si `/rest/posts` apporte des avantages.





