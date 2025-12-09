import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Publication from './src/models/Publication.js';

dotenv.config();

// Récupérer l'email depuis les arguments de ligne de commande
const email = process.argv[2];

const findUser = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    if (email) {
      // Rechercher un utilisateur spécifique par email
      console.log(`🔍 Recherche de l'utilisateur : ${email}\n`);
      
      const user = await User.findOne({ email: email.toLowerCase() }).lean();
      
      if (!user) {
        console.log('❌ Utilisateur non trouvé\n');
      } else {
        console.log('✅ Utilisateur trouvé :\n');
        console.log('─'.repeat(80));
        console.log(`ID: ${user._id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Créé le: ${new Date(user.createdAt).toLocaleString('fr-FR')}`);
        
        // Récupérer les publications de cet utilisateur
        const publications = await Publication.find({ userId: user._id }).lean();
        console.log(`\n📝 Publications (${publications.length}) :`);
        
        if (publications.length === 0) {
          console.log('   Aucune publication');
        } else {
          publications.forEach((pub, index) => {
            console.log(`\n   ${index + 1}. ${pub.title}`);
            console.log(`      Status: ${pub.status}`);
            console.log(`      Créé le: ${new Date(pub.createdAt).toLocaleString('fr-FR')}`);
            if (pub.publishedAt) {
              console.log(`      Publié le: ${new Date(pub.publishedAt).toLocaleString('fr-FR')}`);
            }
          });
        }
        
        console.log('\n' + '─'.repeat(80));
      }
    } else {
      // Lister tous les utilisateurs
      const users = await User.find({}).select('-passwordHash').lean();
      
      console.log(`📊 Nombre d'utilisateurs : ${users.length}\n`);
      
      if (users.length === 0) {
        console.log('ℹ️  Aucun utilisateur dans la base de données.\n');
      } else {
        console.log('👥 Liste des utilisateurs :\n');
        
        for (const user of users) {
          const pubCount = await Publication.countDocuments({ userId: user._id });
          
          console.log(`📧 ${user.email}`);
          console.log(`   ID: ${user._id}`);
          console.log(`   Créé le: ${new Date(user.createdAt).toLocaleString('fr-FR')}`);
          console.log(`   Publications: ${pubCount}`);
          console.log('');
        }
      }
    }

    await mongoose.connection.close();
    console.log('✅ Connexion fermée\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

findUser();

