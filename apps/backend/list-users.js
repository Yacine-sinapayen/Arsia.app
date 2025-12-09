import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const listUsers = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les utilisateurs
    const users = await User.find({}).select('-passwordHash').lean();
    
    console.log(`📊 Nombre d'utilisateurs trouvés : ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('ℹ️  Aucun utilisateur dans la base de données.\n');
    } else {
      console.log('👥 Liste des utilisateurs :\n');
      console.log('─'.repeat(80));
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Utilisateur ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Créé le: ${new Date(user.createdAt).toLocaleString('fr-FR')}`);
        
        // Compter les publications de cet utilisateur
        mongoose.connection.db.collection('publications').countDocuments({ userId: user._id })
          .then(count => {
            if (count > 0) {
              console.log(`   Publications: ${count}`);
            }
          })
          .catch(() => {});
      });
      
      console.log('\n' + '─'.repeat(80));
    }

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n✅ Connexion fermée\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

listUsers();

