import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import {
  getLinkedInAuthUrl,
  exchangeCodeForToken,
  getPersonURN,
  getOrganizationPage,
  refreshLinkedInToken
} from '../services/linkedinService.js';

const router = express.Router();

// GET /api/linkedin/auth - Génère l'URL d'autorisation LinkedIn
router.get('/auth', authMiddleware, (req, res) => {
  try {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
      console.error('❌ Variables d\'environnement LinkedIn manquantes');
      return res.status(500).json({ 
        error: 'Configuration LinkedIn manquante. Vérifiez LINKEDIN_CLIENT_ID et LINKEDIN_CLIENT_SECRET dans .env' 
      });
    }
    
    // Générer un state unique pour la sécurité (utiliser l'ID utilisateur)
    const state = req.user._id.toString();
    const authUrl = getLinkedInAuthUrl(state);
    
    res.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL LinkedIn:', error);
    res.status(500).json({ error: 'Erreur lors de la génération de l\'URL d\'autorisation' });
  }
});

// GET /api/linkedin/callback - Callback OAuth LinkedIn
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_error=${error}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_error=no_code`);
    }

    // Récupérer l'utilisateur depuis le state (qui contient l'ID utilisateur)
    const userId = state;
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_error=user_not_found`);
    }

    // Échanger le code contre un token
    const tokenData = await exchangeCodeForToken(code);
    
    // Récupérer l'URN de la personne
    const personURN = await getPersonURN(tokenData.accessToken);

    // Récupérer la page d'entreprise Webysta
    let organizationURN = null;
    let organizationName = null;
    
    try {
      const organization = await getOrganizationPage(tokenData.accessToken, 'Webysta');
      organizationURN = organization.urn;
      organizationName = organization.name;
      console.log('✅ Page d\'entreprise trouvée:', organizationName, organizationURN);
    } catch (orgError) {
      console.error('⚠️ Erreur lors de la récupération de la page d\'entreprise:', orgError.message);
      // On continue quand même, l'utilisateur pourra réessayer plus tard
    }

    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expiresIn);

    // Sauvegarder les tokens dans le profil utilisateur
    user.linkedin = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: expiresAt,
      personURN: personURN,
      organizationURN: organizationURN,
      organizationName: organizationName,
      connected: true
    };

    await user.save();

    // Rediriger vers le dashboard avec un message de succès
    const redirectUrl = organizationURN 
      ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_connected=true`
      : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_connected=true&warning=no_org`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Erreur lors du callback LinkedIn:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?linkedin_error=callback_error`);
  }
});

// GET /api/linkedin/status - Vérifier le statut de connexion LinkedIn
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      connected: user.linkedin?.connected || false,
      expiresAt: user.linkedin?.expiresAt || null,
      organizationName: user.linkedin?.organizationName || null,
      hasOrganization: !!user.linkedin?.organizationURN
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut LinkedIn:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
  }
});

// POST /api/linkedin/disconnect - Déconnecter LinkedIn
router.post('/disconnect', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.linkedin = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      personURN: null,
      organizationURN: null,
      organizationName: null,
      connected: false
    };

    await user.save();

    res.json({
      success: true,
      message: 'LinkedIn déconnecté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion LinkedIn:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

export default router;

