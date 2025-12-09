import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fonction pour tronquer intelligemment le texte à 500 caractères max
const truncateText = (text, maxLength = 500) => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  // Tronquer à maxLength caractères
  let truncated = text.substring(0, maxLength);
  
  // Essayer de couper à la fin d'une phrase (point, point d'exclamation, point d'interrogation)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  // Si on trouve une fin de phrase dans les 50 derniers caractères, couper là
  if (lastSentenceEnd > maxLength - 50) {
    truncated = truncated.substring(0, lastSentenceEnd + 1);
  } else {
    // Sinon, essayer de couper à un espace
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength - 30) {
      truncated = truncated.substring(0, lastSpace) + '...';
    } else {
      truncated = truncated.trim() + '...';
    }
  }
  
  return truncated;
};

export const generateSeoFromImage = async (imagePath, metadata = {}) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const { title = '', location = '', workType = '', date = '' } = metadata;

    const prompt = `Analyse cette photo d'un travail d'artisan. 
Rédige un texte optimisé SEO en français, court et percutant (50-80 mots, maximum 500 caractères), adapté aux formats LinkedIn et Instagram.
Le texte doit être :
- Concis et accrocheur pour les réseaux sociaux
- Optimisé SEO pour le web
- Adapté aux légendes Instagram (max 2200 caractères, idéalement 300-500 caractères)
- Adapté aux posts LinkedIn (max 1300 caractères, idéalement 300-500 caractères)
- Engageant avec un appel à l'action si possible

Identifie le type de travaux, les matériaux utilisés, le style, le contexte de manière concise.
${location ? `La ville/location est : ${location}.` : ''}
${workType ? `Le type de travaux est : ${workType}.` : ''}
${date ? `La date est : ${date}.` : ''}
Génère également 3-8 mots-clés SEO pertinents séparés par des virgules.

Format de réponse attendu (JSON) :
{
  "seoText": "texte court et percutant de 50-80 mots (max 500 caractères), adapté LinkedIn/Instagram",
  "tags": ["mot-clé1", "mot-clé2", "mot-clé3"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 400
    });

    const content = response.choices[0].message.content;
    
    // Essayer de parser le JSON de la réponse
    let parsedContent;
    try {
      // Extraire le JSON de la réponse si elle contient du markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        parsedContent = JSON.parse(content);
      }
    } catch (parseError) {
      // Si le parsing échoue, créer une structure par défaut
      parsedContent = {
        seoText: truncateText(content, 500) || 'Description générée par IA',
        tags: ['artisan', 'travaux', 'réalisation']
      };
    }

    // S'assurer que le texte ne dépasse pas 500 caractères
    const seoText = truncateText(parsedContent.seoText || content, 500);
    
    return {
      seoText: seoText,
      tags: Array.isArray(parsedContent.tags) 
        ? parsedContent.tags 
        : (parsedContent.tags ? parsedContent.tags.split(',').map(t => t.trim()) : ['artisan', 'travaux'])
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Erreur lors de la génération du contenu SEO: ' + error.message);
  }
};

