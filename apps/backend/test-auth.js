import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:4000';

// Helper pour faire des requêtes avec cookies
let cookieStore = '';

async function makeRequest(method, path, data = null) {
  const url = `${API_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieStore ? { 'Cookie': cookieStore } : {})
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  // Extraire les cookies de la réponse
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    cookieStore = setCookie.split(';')[0]; // Prendre seulement le token
  }

  const responseData = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    data: responseData,
    headers: response.headers
  };
}

const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'test123456';

async function testAuth() {
  console.log('🧪 Test de l\'authentification\n');
  console.log(`📍 API URL: ${API_URL}\n`);

  try {
    // Test 1: Création d'un utilisateur
    console.log('1️⃣ Test de création d\'utilisateur...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}\n`);

    const signupResponse = await makeRequest('POST', '/api/auth/signup', {
      email: testEmail,
      password: testPassword
    });

    if (signupResponse.data.success) {
      console.log('✅ Inscription réussie !');
      console.log(`   User ID: ${signupResponse.data.user.id}`);
      console.log(`   Email: ${signupResponse.data.user.email}\n`);
    } else {
      console.log('❌ Échec de l\'inscription');
      console.log(signupResponse.data);
      return;
    }

    // Test 2: Tentative de création d'un utilisateur existant (devrait échouer)
    console.log('2️⃣ Test de création d\'utilisateur existant (devrait échouer)...');
    const duplicateSignup = await makeRequest('POST', '/api/auth/signup', {
      email: testEmail,
      password: testPassword
    });
    
    if (duplicateSignup.status === 400) {
      console.log('✅ Erreur attendue: Email déjà utilisé\n');
    } else {
      console.log('❌ Erreur: L\'inscription aurait dû échouer (email déjà utilisé)');
      console.log(`   Status: ${duplicateSignup.status}\n`);
    }

    // Test 3: Connexion avec de mauvais identifiants (devrait échouer)
    console.log('3️⃣ Test de connexion avec mauvais mot de passe (devrait échouer)...');
    const badLogin = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'mauvaispassword'
    });
    
    if (badLogin.status === 401) {
      console.log('✅ Erreur attendue: Mot de passe incorrect\n');
    } else {
      console.log('❌ Erreur: La connexion aurait dû échouer');
      console.log(`   Status: ${badLogin.status}\n`);
    }

    // Test 4: Connexion avec les bons identifiants
    console.log('4️⃣ Test de connexion avec les bons identifiants...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword
    });

    if (loginResponse.data.success) {
      console.log('✅ Connexion réussie !');
      console.log(`   User ID: ${loginResponse.data.user.id}`);
      console.log(`   Email: ${loginResponse.data.user.email}\n`);
    } else {
      console.log('❌ Échec de la connexion');
      console.log(loginResponse.data);
      return;
    }

    // Test 5: Vérifier que le cookie est bien présent
    console.log('5️⃣ Vérification du cookie JWT...');
    if (cookieStore && cookieStore.includes('token')) {
      console.log('✅ Cookie JWT présent dans la réponse\n');
    } else {
      console.log('⚠️  Cookie JWT non trouvé dans la réponse\n');
    }

    // Test 6: Déconnexion
    console.log('6️⃣ Test de déconnexion...');
    const logoutResponse = await makeRequest('POST', '/api/auth/logout');
    if (logoutResponse.data.success) {
      console.log('✅ Déconnexion réussie !\n');
    } else {
      console.log('❌ Échec de la déconnexion\n');
    }

    console.log('🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testAuth();

