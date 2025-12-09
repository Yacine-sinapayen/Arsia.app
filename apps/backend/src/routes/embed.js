import express from 'express';

const router = express.Router();

// GET /embed/portfolio.js - Widget JS SEO-friendly
router.get('/portfolio.js', (req, res) => {
  const apiUrl = process.env.API_URL || 'http://localhost:4000';
  
  const jsCode = `
(function() {
  const script = document.currentScript;
  const artisanId = script.getAttribute('data-artisan-id');
  
  if (!artisanId) {
    console.error('Iartisan: data-artisan-id manquant');
    return;
  }
  
  const container = document.getElementById('iartisan-portfolio');
  if (!container) {
    console.error('Iartisan: élément #iartisan-portfolio introuvable');
    return;
  }
  
  fetch('${apiUrl}/api/public/publications?artisanId=' + encodeURIComponent(artisanId))
    .then(response => response.json())
    .then(data => {
      if (data.publications && data.publications.length > 0) {
        let html = '<div class="iartisan-portfolio-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px;">';
        
        data.publications.forEach(pub => {
          html += \`
            <div class="iartisan-card" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <img src="\${pub.imageUrl}" alt="\${pub.title}" style="width: 100%; height: 200px; object-fit: cover;" loading="lazy" />
              <div style="padding: 16px;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 600;">\${pub.title}</h3>
                \${pub.location ? '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 0.875rem;">📍 ' + pub.location + '</p>' : ''}
                <p style="margin: 0 0 12px 0; color: #374151; line-height: 1.5;">\${pub.seoText}</p>
                \${pub.tags && pub.tags.length > 0 ? '<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 12px;">' + pub.tags.map(tag => '<span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: #4b5563;">#' + tag + '</span>').join('') + '</div>' : ''}
              </div>
            </div>
          \`;
        });
        
        html += '</div>';
        container.innerHTML = html;
      } else {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Aucune publication disponible.</p>';
      }
    })
    .catch(error => {
      console.error('Iartisan: Erreur lors du chargement des publications', error);
      container.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 20px;">Erreur lors du chargement des publications.</p>';
    });
})();
`;

  res.setHeader('Content-Type', 'application/javascript');
  res.send(jsCode);
});

export default router;

