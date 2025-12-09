import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testMongoConnection = async () => {
  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI || 'Non défini');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connexion MongoDB réussie !');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState} (1 = connecté)`);
    
    // Test simple : lister les collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\n📚 Collections existantes (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée proprement');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:');
    console.error(`   Message: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Suggestion: Vérifiez que MongoDB est démarré');
      console.error('   Sur macOS: brew services start mongodb-community');
      console.error('   Ou: mongod --dbpath /path/to/data');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Suggestion: Vérifiez vos identifiants MongoDB');
    } else if (!process.env.MONGODB_URI) {
      console.error('\n💡 Suggestion: Créez un fichier .env avec MONGODB_URI');
    }
    
    process.exit(1);
  }
};

testMongoConnection();

