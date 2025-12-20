# Resumate Backend API

Backend API pour l'application de génération de CV optimisé avec IA.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env` à la racine du dossier `backend` avec le contenu suivant :

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/resumate

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

OPENAI_API_KEY=your_openai_api_key_here
```

3. Démarrer le serveur :
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

## Structure du Projet

```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/
│   ├── authController.js    # Contrôleur d'authentification
│   └── cvController.js      # Contrôleur de génération de CV
├── middleware/
│   └── auth.js              # Middleware d'authentification JWT
├── models/
│   ├── User.js              # Modèle User
│   └── CVHistory.js         # Modèle Historique CV
├── routes/
│   ├── authRoutes.js        # Routes d'authentification
│   └── cvRoutes.js          # Routes CV
├── services/
│   ├── openaiService.js     # Service OpenAI pour optimiser le CV
│   └── htmlGeneratorService.js  # Service de génération HTML
├── server.js                # Point d'entrée de l'application
└── package.json
```

## API Endpoints

### Authentification

#### POST `/api/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client"  // optionnel: "client" ou "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "client"
  }
}
```

#### POST `/api/auth/login`
Se connecter.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "client"
  }
}
```

#### GET `/api/auth/me`
Obtenir les informations de l'utilisateur connecté (nécessite authentification).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### CV Generation

#### POST `/api/cv/generate`
Générer un CV optimisé avec l'IA (nécessite authentification).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Body:**
```json
{
  "cvText": "Texte du CV original (obtenu via OCR ou autre)",
  "jobDescription": "Description du poste pour lequel optimiser le CV"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cv_history_id",
    "optimizedCVText": "Texte du CV optimisé",
    "cvHTML": "<html>...</html>",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/cv/history`
Obtenir l'historique de tous les CV générés (nécessite authentification).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "cv_id",
      "optimizedCVText": "Texte optimisé",
      "cvHTML": "<html>...</html>",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "jobDescription": "Description du poste"
    }
  ]
}
```

#### GET `/api/cv/:id`
Obtenir un CV spécifique par son ID (nécessite authentification).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cv_id",
    "originalCVText": "Texte original",
    "jobDescription": "Description du poste",
    "optimizedCVText": "Texte optimisé",
    "cvHTML": "<html>...</html>",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Modèles de Données

### User
- `email` (String, unique, required)
- `password` (String, required, minlength: 6)
- `role` (String, enum: ['admin', 'client'], default: 'client')
- `createdAt` (Date)

### CVHistory
- `user` (ObjectId, ref: User, required)
- `originalCVText` (String, required)
- `jobDescription` (String, required)
- `optimizedCVText` (String, required)
- `cvHTML` (String, required)
- `createdAt` (Date)

## Technologies Utilisées

- **Express.js** - Framework web Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par token
- **OpenAI API** - Optimisation du CV avec GPT-4
- **bcryptjs** - Hachage des mots de passe

## Notes

- Assurez-vous d'avoir une clé API OpenAI valide dans le fichier `.env`
- Le CV HTML généré peut être converti en PDF côté frontend ou avec un service comme Puppeteer
- Tous les CV générés sont automatiquement sauvegardés dans l'historique

