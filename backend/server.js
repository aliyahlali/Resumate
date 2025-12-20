const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const logger = require('./middleware/logger');

// Charger les variables d'environnement
dotenv.config();

// Connecter à MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging - doit être après les middlewares de parsing du body
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cv', require('./routes/cvRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Route de test
app.get('/', (req, res) => {
  console.log('GET / - Route de test appelée');
  res.json({
    success: true,
    message: 'Resumate Backend API is running',
    version: '1.0.0',
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  console.log(`⚠️  Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  // Gestion des erreurs Multer
  if (err instanceof require('multer').MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier est trop volumineux. Taille maximale: 10MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload du fichier',
    });
  }

  // Gestion des autres erreurs
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

