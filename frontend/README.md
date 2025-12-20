# Resumate Frontend

Application React pour le générateur de CV optimisé avec IA.

## Installation

1. Installer les dépendances :
```bash
cd frontend
npm install
```

2. Configurer les variables d'environnement (optionnel) :
Créer un fichier `.env` dans le dossier `frontend` :

```
VITE_API_URL=http://localhost:5000/api
```

Par défaut, l'application utilise `http://localhost:5000/api` pour communiquer avec le backend.

3. Démarrer l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Scripts

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run preview` - Prévisualiser le build de production

## Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Layout.jsx      # Layout principal avec navigation
│   │   └── Layout.css
│   ├── context/            # Context React
│   │   └── AuthContext.jsx # Context d'authentification
│   ├── pages/              # Pages de l'application
│   │   ├── Login.jsx       # Page de connexion
│   │   ├── Register.jsx    # Page d'inscription
│   │   ├── Dashboard.jsx   # Page d'accueil
│   │   ├── GenerateCV.jsx  # Page de génération de CV
│   │   └── History.jsx     # Page d'historique
│   ├── services/           # Services API
│   │   └── api.js          # Configuration axios et services API
│   ├── App.jsx             # Composant principal avec routing
│   ├── main.jsx            # Point d'entrée de l'application
│   └── index.css           # Styles globaux
├── index.html
├── package.json
└── vite.config.js          # Configuration Vite
```

## Fonctionnalités

- ✅ Authentification (Login/Register)
- ✅ Génération de CV optimisé avec IA
- ✅ Historique des CV générés
- ✅ Téléchargement en PDF
- ✅ Interface moderne et responsive
- ✅ Gestion d'état avec Context API
- ✅ Routing avec React Router

## Technologies Utilisées

- **React 18** - Bibliothèque UI
- **React Router** - Routing
- **Vite** - Build tool et dev server
- **Axios** - Requêtes HTTP
- **Context API** - Gestion d'état

## Configuration

L'application communique avec le backend via le proxy configuré dans `vite.config.js`. Par défaut, toutes les requêtes vers `/api` sont redirigées vers `http://localhost:5000`.

Vous pouvez modifier l'URL du backend en créant un fichier `.env` avec :
```
VITE_API_URL=http://localhost:5000/api
```

## Démarrage Rapide

1. Assurez-vous que le backend est démarré sur le port 5000
2. Installez les dépendances : `npm install`
3. Démarrez le frontend : `npm run dev`
4. Ouvrez `http://localhost:3000` dans votre navigateur

## Notes

- L'authentification utilise JWT stocké dans localStorage
- Les CV générés peuvent être téléchargés en PDF via la fonction d'impression du navigateur
- L'application est responsive et fonctionne sur mobile, tablette et desktop

