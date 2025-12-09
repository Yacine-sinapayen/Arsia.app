import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    // Ajouter le nom de la base de données si absent
    let uri = mongoURI;
    if (!uri.includes('/?') && !uri.match(/\/[^/]+$/)) {
      // Si l'URI se termine par / ou ne contient pas de nom de base, ajouter 'iartisan'
      uri = uri.endsWith('/') ? `${uri}iartisan` : `${uri}/iartisan`;
    }

    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
      socketTimeoutMS: 45000, // Timeout socket après 45 secondes
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(`   Message: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Vérifiez votre connexion internet');
      console.error('   2. Vérifiez que MongoDB Atlas est accessible');
      console.error('   3. Vérifiez que votre IP est autorisée dans MongoDB Atlas');
      console.error('   4. Vérifiez votre URI MongoDB dans le fichier .env');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Vérifiez vos identifiants MongoDB dans l\'URI');
      console.error('   2. Vérifiez que l\'utilisateur existe dans MongoDB Atlas');
    } else if (error.message.includes('querySrv')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Problème de résolution DNS (querySrv)');
      console.error('   2. Vérifiez votre connexion internet');
      console.error('   3. ⚠️  Si vous êtes en partage de connexion (hotspot), votre IP a changé !');
      console.error('      → Ajoutez votre nouvelle IP dans MongoDB Atlas → Network Access');
      console.error('      → Ou autorisez 0.0.0.0/0 temporairement (DEV ONLY)');
      console.error('   4. Essayez de redémarrer votre serveur');
      console.error('   5. Vérifiez que MongoDB Atlas est en ligne');
    }
    
    process.exit(1);
  }
};

export default connectDB;

