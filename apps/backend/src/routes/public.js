import express from 'express';
import Publication from '../models/Publication.js';

const router = express.Router();

// GET /api/public/publications?artisanId=...&limit=...&offset=...&workType=...
router.get('/publications', async (req, res) => {
  try {
    const { artisanId, limit, offset, workType } = req.query;

    if (!artisanId) {
      return res.status(400).json({ error: 'artisanId requis' });
    }

    // Valider que artisanId est un ObjectId valide
    if (!artisanId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'artisanId invalide' });
    }

    // Construire la requête de filtrage
    const query = {
      userId: artisanId,
      status: 'published'
    };

    if (workType) {
      query.workType = workType;
    }

    // Pagination
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    // Récupérer les publications avec pagination
    // Tri par publishedAt si disponible, sinon par createdAt
    const publications = await Publication.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('title imageUrl seoText tags location workType date publishedAt createdAt')
      .limit(limitNum)
      .skip(offsetNum)
      .lean();

    // Compter le total pour la pagination
    const total = await Publication.countDocuments(query);

    // Construire l'URL complète de l'image si nécessaire
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const publicationsWithFullUrl = publications.map(pub => {
      // Gérer les cas où imageUrl pourrait être null ou undefined
      let imageUrl = pub.imageUrl || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${apiUrl}${imageUrl}`;
      }

      return {
        id: pub._id ? pub._id.toString() : null,
        title: pub.title || '',
        imageUrl: imageUrl,
        seoText: pub.seoText || '',
        tags: pub.tags || [],
        location: pub.location || '',
        workType: pub.workType || '',
        date: pub.date || null,
        publishedAt: pub.publishedAt || pub.createdAt || null
      };
    });

    res.json({
      success: true,
      artisanId,
      publications: publicationsWithFullUrl,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + publications.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching public publications:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des publications',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;

