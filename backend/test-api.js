/**
 * Script de test pour l'API Resumate
 * Teste le login et la génération de CV
 * 
 * Utilisation: node test-api.js
 */

const axios = require('axios');
require('dotenv').config();

<<<<<<< HEAD
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
=======
// compute base URL using environment variables; remove hard-coded port
const port = process.env.PORT || 5000;
const BASE_URL = process.env.TEST_URL || `http://localhost:${port}`;
>>>>>>> bce18cd (atlas updates)
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logTest(message) {
  log(`\n▶ ${message}`, 'cyan');
}

// Variables globales pour stocker les données de test
let authToken = '';
let userId = '';
let cvId = '';

// Texte de CV de test
const sampleCVText = `Jean Dupont
Développeur Web Full Stack

Email: jean.dupont@email.com
Téléphone: +33 6 12 34 56 78
Adresse: Paris, France

EXPERIENCE PROFESSIONNELLE

2020 - Présent | Développeur Full Stack
TechCorp, Paris
- Développement d'applications web modernes avec React et Node.js
- Création et maintenance d'APIs REST avec Express.js
- Gestion de bases de données MongoDB et MySQL
- Collaboration avec une équipe de 5 développeurs dans un environnement Agile
- Optimisation des performances et résolution de bugs

2018 - 2020 | Développeur Frontend
WebStart, Lyon
- Développement d'interfaces utilisateur avec React et Redux
- Intégration de designs responsive avec CSS et Tailwind
- Optimisation des performances web et amélioration du SEO
- Participation aux revues de code et aux réunions techniques

FORMATION

2016 - 2018 | Master en Informatique
Université de Paris, Paris
Spécialisation en Développement Web et Logiciel

COMPETENCES TECHNIQUES

Langages: JavaScript, TypeScript, Python, HTML, CSS
Frameworks: React, Node.js, Express.js, Next.js
Bases de données: MongoDB, MySQL, PostgreSQL
Outils: Git, Docker, Jenkins, Jira
Méthodologies: Agile, Scrum, TDD

LANGAGES

Français: Langue maternelle
Anglais: Courant (TOEIC 950)
Espagnol: Intermédiaire`;

// Description de poste de test
const sampleJobDescription = `Nous recherchons un Développeur Full Stack expérimenté pour rejoindre notre équipe dynamique.

Responsabilités:
- Développer des applications web modernes avec React et Node.js
- Concevoir et implémenter des APIs REST robustes et sécurisées
- Travailler avec des bases de données NoSQL (MongoDB) et relationnelles
- Collaborer avec l'équipe pour livrer des produits de qualité dans les délais
- Participer aux réunions techniques et aux revues de code
- Optimiser les performances et assurer la scalabilité des applications

Compétences requises:
- Maîtrise de JavaScript/TypeScript, React, Node.js
- Expérience solide avec MongoDB et bases de données
- Connaissance de Git et des méthodologies agiles (Scrum)
- Expérience avec Docker et déploiement d'applications
- Bonne communication et esprit d'équipe
- Capacité à travailler en mode startup avec autonomie

Atouts:
- Connaissance de Next.js
- Expérience avec PostgreSQL
- Certification agile`;

/**
 * Test 1: Créer un compte utilisateur
 */
async function testRegister() {
  logTest('Test 1: Création de compte utilisateur');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      role: 'client',
    });

    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      userId = response.data.user.id;
      logSuccess(`Compte créé avec succès`);
      logInfo(`Email: ${TEST_EMAIL}`);
      logInfo(`User ID: ${userId}`);
      logInfo(`Token reçu: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('La réponse ne contient pas de token');
      return false;
    }
  } catch (error) {
    if (error.response) {
      // L'utilisateur existe peut-être déjà, essayons de se connecter
      if (error.response.status === 400 && error.response.data.message?.includes('already exists')) {
        logInfo('L\'utilisateur existe déjà, tentative de connexion...');
        return await testLogin();
      }
      logError(`Erreur ${error.response.status}: ${error.response.data.message || error.message}`);
    } else {
      logError(`Erreur de connexion: ${error.message}`);
      logError('Assurez-vous que le serveur est démarré sur ' + BASE_URL);
    }
    return false;
  }
}

/**
 * Test 2: Se connecter
 */
async function testLogin() {
  logTest('Test 2: Connexion (Login)');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      userId = response.data.user.id;
      logSuccess(`Connexion réussie`);
      logInfo(`Email: ${TEST_EMAIL}`);
      logInfo(`User ID: ${userId}`);
      logInfo(`Token reçu: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('La réponse ne contient pas de token');
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur ${error.response.status}: ${error.response.data.message || error.message}`);
    } else {
      logError(`Erreur de connexion: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test 3: Générer un CV optimisé
 */
async function testGenerateCV() {
  logTest('Test 3: Génération de CV optimisé');
  
  if (!authToken) {
    logError('Token d\'authentification manquant. Assurez-vous que les tests de login ont réussi.');
    return false;
  }

  try {
    logInfo('Envoi de la requête de génération de CV...');
    logInfo('Cela peut prendre quelques secondes (appel à l\'API OpenAI)...');
    
    const response = await axios.post(
      `${BASE_URL}/api/cv/generate`,
      {
        cvText: sampleCVText,
        jobDescription: sampleJobDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 secondes de timeout pour l'API OpenAI
      }
    );

    if (response.data.success && response.data.data) {
      cvId = response.data.data.id;
      const cvData = response.data.data;
      
      logSuccess(`CV généré avec succès!`);
      logInfo(`CV ID: ${cvId}`);
      logInfo(`Texte optimisé (premiers 200 caractères): ${cvData.optimizedCVText.substring(0, 200)}...`);
      logInfo(`HTML généré (taille): ${cvData.cvHTML.length} caractères`);
      logInfo(`Date de création: ${new Date(cvData.createdAt).toLocaleString()}`);
      return true;
    } else {
      logError('La réponse ne contient pas de données de CV');
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur ${error.response.status}: ${error.response.data.message || error.message}`);
      if (error.response.data.error) {
        logError(`Détails: ${error.response.data.error}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      logError('Timeout: La requête a pris trop de temps. L\'API OpenAI peut être lente.');
    } else {
      logError(`Erreur: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test 4: Obtenir l'historique des CV
 */
async function testGetHistory() {
  logTest('Test 4: Récupération de l\'historique des CV');
  
  if (!authToken) {
    logError('Token d\'authentification manquant');
    return false;
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/cv/history`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.success) {
      logSuccess(`Historique récupéré avec succès`);
      logInfo(`Nombre de CV: ${response.data.count}`);
      if (response.data.data && response.data.data.length > 0) {
        logInfo(`Dernier CV: ${response.data.data[0]._id}`);
      }
      return true;
    } else {
      logError('La réponse n\'est pas un succès');
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(`Erreur ${error.response.status}: ${error.response.data.message || error.message}`);
    } else {
      logError(`Erreur: ${error.message}`);
    }
    return false;
  }
}

/**
 * Fonction principale pour exécuter tous les tests
 */
async function runAllTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🧪 DÉMARRAGE DES TESTS DE L\'API RESUMATE', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  const results = {
    register: false,
    login: false,
    generateCV: false,
    history: false,
  };

  // Test 1: Créer un compte (ou se connecter si existe déjà)
  results.register = await testRegister();
  
  if (!results.register) {
    logError('\n❌ Échec du test de création de compte. Arrêt des tests.');
    process.exit(1);
  }

  // Test 2: Se connecter (si on vient de créer le compte, on a déjà le token, mais testons quand même)
  if (authToken) {
    results.login = await testLogin();
  }

  // Test 3: Générer un CV
  results.generateCV = await testGenerateCV();

  // Test 4: Obtenir l'historique
  if (results.generateCV) {
    results.history = await testGetHistory();
  }

  // Résumé des tests
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 RÉSUMÉ DES TESTS', 'cyan');
  log('='.repeat(60), 'cyan');
  
  log(`\n1. Création de compte: ${results.register ? '✓ RÉUSSI' : '✗ ÉCHOUÉ'}`, results.register ? 'green' : 'red');
  log(`2. Connexion (Login): ${results.login ? '✓ RÉUSSI' : '✗ ÉCHOUÉ'}`, results.login ? 'green' : 'red');
  log(`3. Génération de CV: ${results.generateCV ? '✓ RÉUSSI' : '✗ ÉCHOUÉ'}`, results.generateCV ? 'green' : 'red');
  log(`4. Historique des CV: ${results.history ? '✓ RÉUSSI' : '✗ ÉCHOUÉ'}`, results.history ? 'green' : 'red');

  const allPassed = Object.values(results).every(r => r);
  
  log('\n' + '='.repeat(60), 'cyan');
  if (allPassed) {
    log('✅ TOUS LES TESTS ONT RÉUSSI!', 'green');
  } else {
    log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ', 'yellow');
  }
  log('='.repeat(60) + '\n', 'cyan');

  process.exit(allPassed ? 0 : 1);
}

// Exécuter les tests
if (require.main === module) {
  runAllTests().catch((error) => {
    logError(`\nErreur fatale: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  testRegister,
  testLogin,
  testGenerateCV,
  testGetHistory,
  runAllTests,
};

