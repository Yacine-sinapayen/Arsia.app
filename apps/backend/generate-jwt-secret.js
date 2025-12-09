import crypto from 'crypto';

/**
 * Script pour générer un JWT_SECRET sécurisé
 * 
 * Le JWT_SECRET est utilisé pour :
 * 1. Signer les tokens JWT lors de la création (inscription/connexion)
 * 2. Vérifier l'authenticité des tokens JWT lors des requêtes authentifiées
 * 
 * IMPORTANT : 
 * - Ce secret doit être unique et aléatoire
 * - Ne JAMAIS le partager ou le commiter dans Git
 * - Utilisez un secret différent pour chaque environnement (dev, staging, production)
 * - Minimum 32 caractères recommandé pour la sécurité
 */

function generateJWTSecret(length = 64) {
  // Génère une chaîne aléatoire cryptographiquement sécurisée
  return crypto.randomBytes(length).toString('hex');
}

const secret = generateJWTSecret();

console.log('🔐 JWT_SECRET généré :\n');
console.log('─'.repeat(80));
console.log(secret);
console.log('─'.repeat(80));
console.log('\n📋 Instructions :');
console.log('1. Copiez ce secret');
console.log('2. Ajoutez-le dans votre fichier .env :');
console.log(`   JWT_SECRET=${secret}`);
console.log('\n⚠️  IMPORTANT :');
console.log('   - Ne partagez JAMAIS ce secret');
console.log('   - Ne le commitez JAMAIS dans Git');
console.log('   - Utilisez un secret différent pour la production');
console.log('   - Gardez-le en sécurité (gestionnaire de mots de passe, etc.)\n');

