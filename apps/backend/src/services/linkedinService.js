import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:4000/api/linkedin/callback';
const API_URL = process.env.API_URL || 'http://localhost:4000';

/**
 * Génère l'URL d'autorisation LinkedIn avec les permissions pour pages d'entreprise
 */
export const getLinkedInAuthUrl = (state, requestOrganizationScopes = null) => {
  // Scopes de base (toujours nécessaires)
  const baseScopes = [
    'openid',
    'profile',
    'email',
    'w_member_social'           // Pour publier sur profil personnel
  ];
  
  // Scopes pour pages d'entreprise (optionnels, nécessitent approbation LinkedIn)
  const organizationScopes = [
    'r_organization_social',     // Pour lire les pages d'entreprise
    'w_organization_social'       // Pour publier sur pages d'entreprise
  ];
  
  // Par défaut, essayer d'inclure les scopes organization
  // Mais si la variable d'environnement est définie à 'false', on les exclut
  // Cela permet de tester avec uniquement le profil personnel en attendant l'approbation LinkedIn
  const useOrganizationScopes = requestOrganizationScopes !== null 
    ? requestOrganizationScopes 
    : (process.env.LINKEDIN_USE_ORGANIZATION_SCOPES !== 'false');
  
  // Construire la liste des scopes
  const scopes = useOrganizationScopes 
    ? [...baseScopes, ...organizationScopes]
    : baseScopes;
  
  if (!useOrganizationScopes) {
    console.log('⚠️ Scopes organization désactivés - publication uniquement sur profil personnel');
  }
  
  const scope = scopes.join(' ');
  
  // Logs pour déboguer
  console.log('🔗 LinkedIn Configuration:');
  console.log('  - Client ID:', LINKEDIN_CLIENT_ID ? '✅ Défini' : '❌ Manquant');
  console.log('  - Redirect URI:', LINKEDIN_REDIRECT_URI);
  console.log('  - Scopes:', scope);
  
  // S'assurer que le redirect_uri est correctement encodé
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state: state,
    scope: scope,
    prompt: 'consent' // Force une nouvelle demande d'autorisation même si déjà connecté
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  console.log('  - Auth URL générée:', authUrl.substring(0, 100) + '...');
  
  return authUrl;
};

/**
 * Échange le code d'autorisation contre un access token
 */
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token
    };
  } catch (error) {
    console.error('Erreur lors de l\'échange du code LinkedIn:', error.response?.data || error.message);
    throw new Error('Erreur lors de l\'obtention du token LinkedIn');
  }
};

/**
 * Récupère le profil LinkedIn de l'utilisateur
 */
export const getLinkedInProfile = async (accessToken) => {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil LinkedIn:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération du profil LinkedIn');
  }
};

/**
 * Récupère l'URN de la personne LinkedIn
 */
export const getPersonURN = async (accessToken) => {
  try {
    const profile = await getLinkedInProfile(accessToken);
    return `urn:li:person:${profile.sub}`;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URN:', error);
    throw error;
  }
};

/**
 * Récupère les pages d'entreprise où l'utilisateur est ADMIN
 * Retourne la page "Webysta" si elle existe
 */
export const getOrganizationPage = async (accessToken, organizationName = 'Webysta') => {
  try {
    // Récupérer les pages d'entreprise avec le bon endpoint
    const response = await axios.get(
      `https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    if (response.data.elements && response.data.elements.length > 0) {
      for (const element of response.data.elements) {
        const orgURN = element.organization || element.organizationalTarget;
        
        if (!orgURN) {
          continue;
        }
        
        // Extraire l'ID de l'organisation depuis l'URN
        const orgId = orgURN.replace('urn:li:organization:', '');
        
        // Récupérer les détails de l'organisation
        try {
          const orgResponse = await axios.get(
            `https://api.linkedin.com/v2/organizations/${orgId}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
              }
            }
          );
          
          const orgName = orgResponse.data.name?.localized?.en_US || 
                         orgResponse.data.name?.localized?.fr_FR ||
                         orgResponse.data.name || 
                         'Page entreprise';
          
          // Si c'est Webysta, on le retourne
          if (orgName.toLowerCase().includes(organizationName.toLowerCase())) {
            return {
              urn: orgURN,
              name: orgName,
              id: orgId
            };
          }
        } catch (orgError) {
          console.error('Erreur lors de la récupération des détails de l\'organisation:', orgError.response?.data || orgError.message);
        }
      }
    }

    // Si Webysta n'est pas trouvé, retourner la première page disponible
    if (response.data.elements && response.data.elements.length > 0) {
      const firstElement = response.data.elements[0];
      const orgURN = firstElement.organization || firstElement.organizationalTarget;
      const orgId = orgURN.replace('urn:li:organization:', '');
      
      try {
        const orgResponse = await axios.get(
          `https://api.linkedin.com/v2/organizations/${orgId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'X-Restli-Protocol-Version': '2.0.0'
            }
          }
        );
        
        return {
          urn: orgURN,
          name: orgResponse.data.name?.localized?.en_US || orgResponse.data.name || 'Page entreprise',
          id: orgId
        };
      } catch (error) {
        // Retourner quand même l'URN même sans les détails
        return {
          urn: orgURN,
          name: 'Page entreprise',
          id: orgId
        };
      }
    }

    throw new Error('Aucune page d\'entreprise trouvée');
  } catch (error) {
    console.error('Erreur lors de la récupération de la page d\'entreprise:', error.response?.data || error.message);
    if (error.response?.status === 403) {
      throw new Error('Permissions insuffisantes. Vous devez avoir la permission w_organization_social et être admin de la page.');
    }
    throw new Error('Erreur lors de la récupération de la page d\'entreprise: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * Upload une image sur LinkedIn et retourne l'URN de l'asset
 */
export const uploadImageToLinkedIn = async (accessToken, ownerURN, imageUrl) => {
  try {
    // Étape 1 : Enregistrer l'upload
    const registerResponse = await axios.post(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: ownerURN,
          serviceRelationships: [{
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent'
          }]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const asset = registerResponse.data.value.asset;

    // Étape 2 : Télécharger l'image depuis notre serveur
    const imageResponse = await axios.get(imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`, {
      responseType: 'arraybuffer'
    });

    // Étape 3 : Uploader l'image sur LinkedIn
    await axios.put(uploadUrl, imageResponse.data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'image/jpeg'
      }
    });

    return asset;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image sur LinkedIn:', error.response?.data || error.message);
    throw new Error('Erreur lors de l\'upload de l\'image sur LinkedIn');
  }
};

/**
 * Publie un post sur LinkedIn (page d'entreprise ou profil personnel) avec texte et image
 * @param {string} accessToken - Token d'accès LinkedIn
 * @param {string} authorURN - URN de l'auteur (organisation ou personne)
 * @param {string} content - Contenu du post
 * @param {string|null} imageUrl - URL de l'image (optionnel)
 * @param {boolean} isOrganization - true si c'est une page d'entreprise, false si c'est un profil personnel
 */
export const publishToLinkedIn = async (accessToken, authorURN, content, imageUrl = null, isOrganization = false) => {
  try {
    let media = null;

    // Si une image est fournie, l'uploader
    if (imageUrl) {
      const asset = await uploadImageToLinkedIn(accessToken, authorURN, imageUrl);
      media = [{
        status: 'READY',
        media: asset,
        title: {
          text: 'Publication Arsia'
        }
      }];
    }

    // Construire le contenu du post
    const shareContent = {
      shareCommentary: {
        text: content
      },
      shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE'
    };

    if (media) {
      shareContent.media = media;
    }

    // Format de publication (identique pour profil et page entreprise)
    const postData = {
      author: authorURN,  // URN de l'organisation ou de la personne
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': shareContent
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log('📤 Publication LinkedIn:', {
      author: authorURN,
      isOrganization: isOrganization,
      hasImage: !!imageUrl
    });

    // Publier le post
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    console.log('✅ Publication LinkedIn réussie:', response.data.id);

    return {
      success: true,
      postId: response.data.id,
      message: isOrganization 
        ? 'Publication LinkedIn réussie sur la page Webysta'
        : 'Publication LinkedIn réussie sur votre profil'
    };
  } catch (error) {
    console.error('❌ Erreur lors de la publication sur LinkedIn:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      if (isOrganization) {
        throw new Error('Permission refusée. Vérifiez que vous avez la permission w_organization_social et que vous êtes admin de la page Webysta.');
      } else {
        throw new Error('Permission refusée. Vérifiez que vous avez la permission w_member_social.');
      }
    }
    
    throw new Error('Erreur lors de la publication sur LinkedIn: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * Rafraîchit un access token expiré
 */
export const refreshLinkedInToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      refreshToken: response.data.refresh_token || refreshToken
    };
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token LinkedIn:', error.response?.data || error.message);
    throw new Error('Erreur lors du rafraîchissement du token LinkedIn');
  }
};

