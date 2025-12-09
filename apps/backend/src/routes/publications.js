import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Publication from '../models/Publication.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { generateSeoFromImage } from '../services/openaiService.js';
import { enhanceImageForSocialMedia } from '../services/imageEnhancement.js';
import { publishToLinkedIn, refreshLinkedInToken } from '../services/linkedinService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'publication-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// GET /api/publications - Récupérer les publications de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const publications = await Publication.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, publications });
  } catch (error) {
    console.error('Error fetching publications:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des publications' });
  }
});

// POST /api/publications - Créer une nouvelle publication (draft)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image requise' });
    }

    const { title, location, workType, date } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Titre requis' });
    }

    const imagePath = req.file.path;
    
    // Améliorer l'image pour la rendre plus "instagramable"
    console.log('🎨 Amélioration de l\'image...');
    const enhancedImagePath = await enhanceImageForSocialMedia(imagePath);
    
    const imageUrl = `/uploads/${req.file.filename}`;

    // Générer le contenu SEO avec OpenAI (utiliser l'image améliorée)
    let seoData;
    try {
      seoData = await generateSeoFromImage(enhancedImagePath, {
        title,
        location,
        workType,
        date
      });
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la génération du contenu SEO: ' + openaiError.message
      });
    }

    // Créer la publication en brouillon
    const publication = new Publication({
      userId: req.user._id,
      title,
      location: location || '',
      workType: workType || '',
      date: date ? new Date(date) : new Date(),
      imageUrl,
      seoText: seoData.seoText,
      tags: seoData.tags,
      status: 'draft'
    });

    await publication.save();

    res.json({
      success: true,
      publication: publication.toObject()
    });
  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la publication' });
  }
});

// POST /api/publications/:id/publish - Publier une publication
router.post('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({ error: 'Publication non trouvée' });
    }

    if (publication.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Récupérer l'utilisateur avec ses infos LinkedIn
    const user = await User.findById(req.user._id);
    
    // Publier sur LinkedIn si l'utilisateur est connecté
    let linkedinPostId = null;
    let linkedinError = null;
    
    if (user.linkedin?.connected && user.linkedin?.accessToken) {
      try {
        // Vérifier si le token est expiré et le rafraîchir si nécessaire
        let accessToken = user.linkedin.accessToken;
        let refreshToken = user.linkedin.refreshToken;
        
        if (user.linkedin.expiresAt && new Date() >= user.linkedin.expiresAt) {
          console.log('Token LinkedIn expiré, rafraîchissement...');
          const newTokenData = await refreshLinkedInToken(refreshToken);
          accessToken = newTokenData.accessToken;
          refreshToken = newTokenData.refreshToken;
          
          // Mettre à jour les tokens dans la base de données
          user.linkedin.accessToken = accessToken;
          user.linkedin.refreshToken = refreshToken;
          user.linkedin.expiresAt = new Date();
          user.linkedin.expiresAt.setSeconds(user.linkedin.expiresAt.getSeconds() + newTokenData.expiresIn);
          await user.save();
        }

        // Construire le contenu du post LinkedIn
        const API_URL = process.env.API_URL || 'http://localhost:4000';
        const imageUrl = publication.imageUrl.startsWith('http') 
          ? publication.imageUrl 
          : `${API_URL}${publication.imageUrl}`;
        
        const linkedinContent = `${publication.title}\n\n${publication.seoText}\n\n${publication.location ? `📍 ${publication.location}` : ''}\n\n${publication.tags && publication.tags.length > 0 ? publication.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') : ''}`;

        // Déterminer l'URN à utiliser (page d'entreprise Webysta en priorité, sinon profil personnel)
        const authorURN = user.linkedin.organizationURN || user.linkedin.personURN;
        const isOrganization = !!user.linkedin.organizationURN;

        if (!authorURN) {
          throw new Error('Aucun URN disponible pour la publication LinkedIn');
        }

        // Publier sur LinkedIn (page d'entreprise ou profil personnel)
        const linkedinResult = await publishToLinkedIn(
          accessToken,
          authorURN,
          linkedinContent,
          imageUrl,
          isOrganization
        );

        linkedinPostId = linkedinResult.postId;
        console.log(`✅ Publication LinkedIn réussie ${isOrganization ? 'sur Webysta' : 'sur votre profil'}:`, linkedinPostId);
      } catch (linkedinErr) {
        console.error('❌ Erreur lors de la publication LinkedIn:', linkedinErr);
        linkedinError = linkedinErr.message;
        // Ne pas bloquer la publication principale si LinkedIn échoue
      }
    }

    // Publier la publication dans l'application
    publication.status = 'published';
    publication.publishedAt = new Date();
    
    // Stocker l'ID du post LinkedIn si disponible
    if (linkedinPostId) {
      publication.linkedinPostId = linkedinPostId;
    }
    
    await publication.save();

    res.json({
      success: true,
      publication: publication.toObject(),
      linkedin: {
        published: !!linkedinPostId,
        postId: linkedinPostId,
        error: linkedinError
      }
    });
  } catch (error) {
    console.error('Error publishing publication:', error);
    res.status(500).json({ error: 'Erreur lors de la publication' });
  }
});

export default router;

