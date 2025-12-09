# Intégration des publications sur un site vitrine

Ce guide explique comment intégrer vos publications Iartisan sur votre site vitrine en utilisant l'API REST.

## 📋 Prérequis

1. Avoir un compte Iartisan avec des publications publiées
2. Connaître votre ID utilisateur MongoDB
3. Avoir accès à l'URL de l'API Iartisan (en production ou développement)

## 🔑 Récupérer votre ID utilisateur

### Méthode 1 : Via l'API (recommandé)

Si vous êtes connecté à votre compte Iartisan, vous pouvez récupérer votre ID via l'endpoint `/api/auth/me` :

```javascript
// Depuis votre navigateur (console) ou votre application
fetch('https://votre-api.com/api/auth/me', {
  credentials: 'include' // Pour envoyer les cookies
})
  .then(response => response.json())
  .then(data => {
    console.log('Votre ID utilisateur:', data.user.id);
  });
```

### Méthode 2 : Via le script npm

```bash
cd apps/backend
npm run find:user -- votre-email@example.com
```

## 📡 API Endpoints

### GET /api/public/publications

Récupère les publications publiées d'un artisan.

**Paramètres de requête :**
- `artisanId` (requis) : ID MongoDB de l'artisan
- `limit` (optionnel) : Nombre de publications à retourner (défaut: 20)
- `offset` (optionnel) : Nombre de publications à ignorer (défaut: 0)
- `workType` (optionnel) : Filtrer par type de travail

**Exemple de requête :**
```
GET /api/public/publications?artisanId=507f1f77bcf86cd799439011&limit=10&offset=0
```

**Réponse :**
```json
{
  "success": true,
  "artisanId": "507f1f77bcf86cd799439011",
  "publications": [
    {
      "id": "507f191e810c19729de860ea",
      "title": "Rénovation complète d'une cuisine",
      "imageUrl": "https://votre-api.com/uploads/publication-1234567890.jpg",
      "seoText": "Découvrez cette magnifique rénovation de cuisine...",
      "tags": ["cuisine", "rénovation", "carrelage"],
      "location": "Paris, France",
      "workType": "Rénovation",
      "date": "2024-01-15T00:00:00.000Z",
      "publishedAt": "2024-01-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

## 💻 Exemples d'intégration

### Exemple 1 : HTML + JavaScript Vanilla

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mes Réalisations</title>
  <style>
    .portfolio-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .publication-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .publication-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .publication-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .publication-card-content {
      padding: 16px;
    }
    .publication-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .publication-card .location {
      margin: 0 0 8px 0;
      color: #6b7280;
      font-size: 0.875rem;
    }
    .publication-card .description {
      margin: 0 0 12px 0;
      color: #374151;
      line-height: 1.5;
    }
    .publication-card .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 12px;
    }
    .publication-card .tag {
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: #4b5563;
    }
    .loading {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }
    .error {
      text-align: center;
      padding: 40px;
      color: #ef4444;
    }
  </style>
</head>
<body>
  <h1>Mes Réalisations</h1>
  <div id="portfolio-container" class="loading">Chargement...</div>

  <script>
    const API_URL = 'https://votre-api.com'; // Remplacez par l'URL de votre API
    const ARTISAN_ID = 'VOTRE_USER_ID'; // Remplacez par votre ID utilisateur

    async function loadPublications() {
      const container = document.getElementById('portfolio-container');
      
      try {
        const response = await fetch(
          `${API_URL}/api/public/publications?artisanId=${ARTISAN_ID}&limit=20`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des publications');
        }
        
        const data = await response.json();
        
        if (data.publications && data.publications.length > 0) {
          container.className = 'portfolio-container';
          container.innerHTML = data.publications.map(pub => `
            <div class="publication-card">
              <img src="${pub.imageUrl}" alt="${pub.title}" loading="lazy" />
              <div class="publication-card-content">
                <h3>${pub.title}</h3>
                ${pub.location ? `<p class="location">📍 ${pub.location}</p>` : ''}
                <p class="description">${pub.seoText}</p>
                ${pub.tags && pub.tags.length > 0 ? `
                  <div class="tags">
                    ${pub.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('');
        } else {
          container.className = 'error';
          container.innerHTML = '<p>Aucune publication disponible.</p>';
        }
      } catch (error) {
        console.error('Erreur:', error);
        container.className = 'error';
        container.innerHTML = '<p>Erreur lors du chargement des publications.</p>';
      }
    }

    // Charger les publications au chargement de la page
    loadPublications();
  </script>
</body>
</html>
```

### Exemple 2 : React

```jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'https://votre-api.com';
const ARTISAN_ID = 'VOTRE_USER_ID';

function Portfolio() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPublications() {
      try {
        const response = await fetch(
          `${API_URL}/api/public/publications?artisanId=${ARTISAN_ID}&limit=20`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement');
        }
        
        const data = await response.json();
        setPublications(data.publications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPublications();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="portfolio-container">
      {publications.map(pub => (
        <div key={pub.id} className="publication-card">
          <img src={pub.imageUrl} alt={pub.title} loading="lazy" />
          <div className="publication-card-content">
            <h3>{pub.title}</h3>
            {pub.location && <p className="location">📍 {pub.location}</p>}
            <p className="description">{pub.seoText}</p>
            {pub.tags && pub.tags.length > 0 && (
              <div className="tags">
                {pub.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Portfolio;
```

### Exemple 3 : Pagination

```javascript
let currentOffset = 0;
const limit = 10;

async function loadMorePublications() {
  try {
    const response = await fetch(
      `${API_URL}/api/public/publications?artisanId=${ARTISAN_ID}&limit=${limit}&offset=${currentOffset}`
    );
    
    const data = await response.json();
    
    // Ajouter les nouvelles publications à la liste existante
    displayPublications(data.publications);
    
    // Vérifier s'il y a plus de publications
    if (data.pagination.hasMore) {
      currentOffset += limit;
      // Afficher un bouton "Charger plus"
    } else {
      // Masquer le bouton "Charger plus"
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Exemple 4 : Filtrage par type de travail

```javascript
async function loadPublicationsByWorkType(workType) {
  try {
    const url = workType 
      ? `${API_URL}/api/public/publications?artisanId=${ARTISAN_ID}&workType=${workType}`
      : `${API_URL}/api/public/publications?artisanId=${ARTISAN_ID}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    displayPublications(data.publications);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Utilisation
loadPublicationsByWorkType('Rénovation'); // Filtrer par type
loadPublicationsByWorkType(null); // Afficher tout
```

## 🎨 Personnalisation

Vous pouvez personnaliser complètement l'affichage des publications selon votre design :

- **CSS personnalisé** : Utilisez vos propres classes CSS
- **Layout** : Choisissez entre grille, liste, carrousel, etc.
- **Filtres** : Ajoutez des filtres par type de travail, date, localisation
- **Recherche** : Implémentez une barre de recherche
- **Lightbox** : Ajoutez une galerie d'images en plein écran

## 🔒 Sécurité

- Les routes publiques (`/api/public/*`) sont accessibles depuis n'importe quel site (CORS ouvert)
- Seules les publications avec le statut `published` sont retournées
- Les données sensibles (mots de passe, tokens) ne sont jamais exposées

## 🚀 Mise en production

1. **Remplacer l'URL de l'API** : Utilisez l'URL de production au lieu de `localhost`
2. **HTTPS** : Assurez-vous que votre API utilise HTTPS en production
3. **Performance** : Utilisez la pagination pour limiter le nombre de publications chargées
4. **Cache** : Mettez en place un cache côté client pour améliorer les performances

## 📝 Notes importantes

- Les URLs d'images sont automatiquement complétées avec l'URL de l'API
- Les publications sont triées par date de publication (plus récentes en premier)
- Le champ `seoText` contient le texte optimisé SEO généré par l'IA
- Les tags sont générés automatiquement par l'IA pour améliorer le référencement

## ❓ Questions fréquentes

**Q: Puis-je utiliser cette API depuis n'importe quel site ?**  
R: Oui, les routes publiques sont accessibles depuis n'importe quel domaine grâce à CORS.

**Q: Dois-je m'authentifier pour récupérer les publications ?**  
R: Non, les publications publiques sont accessibles sans authentification.

**Q: Comment mettre à jour les publications sur mon site vitrine ?**  
R: Les publications sont mises à jour automatiquement. Il suffit de recharger la page ou d'implémenter un système de rafraîchissement périodique.

**Q: Puis-je filtrer les publications par date ?**  
R: Actuellement, vous pouvez filtrer par `workType`. Le filtrage par date peut être ajouté si nécessaire.

