import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Améliore une image pour la rendre plus "instagramable"
 * Applique des ajustements automatiques sans ajouter ou supprimer d'éléments
 * 
 * @param {string} inputPath - Chemin de l'image originale
 * @param {string} outputPath - Chemin où sauvegarder l'image améliorée
 * @returns {Promise<string>} - Chemin de l'image améliorée
 */
export const enhanceImageForSocialMedia = async (inputPath, outputPath = null) => {
  try {
    // Si aucun chemin de sortie n'est fourni, remplacer l'original
    const finalOutputPath = outputPath || inputPath;
    
    // Lire les métadonnées de l'image pour détecter le format
    const metadata = await sharp(inputPath).metadata();
    const format = metadata.format; // 'jpeg', 'png', 'webp', etc.
    
    // Créer un pipeline Sharp avec les améliorations
    let pipeline = sharp(inputPath)
      // Ajuster la luminosité (+10%) pour un rendu plus lumineux
      .modulate({
        brightness: 1.1,
        saturation: 1.15, // Augmenter légèrement la saturation pour des couleurs plus vives
        hue: 0 // Pas de changement de teinte
      })
      // Améliorer le contraste
      .linear(1.1, -(128 * 0.1)) // Augmenter le contraste de 10%
      // Améliorer la netteté (sharpen)
      .sharpen({
        sigma: 1.5,
        flat: 1,
        jagged: 2
      })
      // Ajuster la balance des blancs (légèrement plus chaud)
      .tint({ r: 255, g: 252, b: 240 }); // Teinte légèrement chaude
    
    // Appliquer le format approprié selon le type d'image
    if (format === 'png') {
      await pipeline
        .png({ 
          quality: 90,
          compressionLevel: 9
        })
        .toFile(finalOutputPath);
    } else if (format === 'webp') {
      await pipeline
        .webp({ 
          quality: 90
        })
        .toFile(finalOutputPath);
    } else {
      // Par défaut, convertir en JPEG (meilleur pour le web et les réseaux sociaux)
      await pipeline
        .jpeg({ 
          quality: 90, // Haute qualité
          progressive: true, // JPEG progressif pour un chargement plus rapide
          mozjpeg: true // Utiliser mozjpeg pour une meilleure compression
        })
        .toFile(finalOutputPath);
    }
    
    console.log(`✅ Image améliorée sauvegardée : ${finalOutputPath} (format: ${format})`);
    return finalOutputPath;
    
  } catch (error) {
    console.error('Erreur lors de l\'amélioration de l\'image:', error);
    // En cas d'erreur, retourner l'image originale
    return inputPath;
  }
};

/**
 * Version alternative avec des ajustements plus subtils
 * Pour des photos déjà bien exposées
 */
export const enhanceImageSubtle = async (inputPath, outputPath = null) => {
  try {
    const finalOutputPath = outputPath || inputPath;
    
    await sharp(inputPath)
      .modulate({
        brightness: 1.05, // Légère augmentation de luminosité
        saturation: 1.1, // Légère augmentation de saturation
        hue: 0
      })
      .linear(1.05, -(128 * 0.05)) // Contraste très subtil
      .sharpen({
        sigma: 1,
        flat: 1,
        jagged: 1.5
      })
      .jpeg({ 
        quality: 92,
        progressive: true,
        mozjpeg: true
      })
      .toFile(finalOutputPath);
    
    return finalOutputPath;
  } catch (error) {
    console.error('Erreur lors de l\'amélioration subtile:', error);
    return inputPath;
  }
};

/**
 * Version avec des ajustements plus prononcés (style Instagram)
 */
export const enhanceImageVibrant = async (inputPath, outputPath = null) => {
  try {
    const finalOutputPath = outputPath || inputPath;
    
    await sharp(inputPath)
      .modulate({
        brightness: 1.15, // Luminosité plus élevée
        saturation: 1.25, // Saturation plus élevée pour des couleurs vives
        hue: 0
      })
      .linear(1.15, -(128 * 0.15)) // Contraste plus prononcé
      .sharpen({
        sigma: 2,
        flat: 1.5,
        jagged: 2.5
      })
      .tint({ r: 255, g: 250, b: 235 }) // Teinte chaude plus prononcée
      .jpeg({ 
        quality: 90,
        progressive: true,
        mozjpeg: true
      })
      .toFile(finalOutputPath);
    
    return finalOutputPath;
  } catch (error) {
    console.error('Erreur lors de l\'amélioration vibrante:', error);
    return inputPath;
  }
};

