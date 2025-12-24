# Resumate - Resume Personalization Platform

A full-stack resume personalization platform that uses AI to optimize CVs based on job descriptions.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- OpenAI API Key (for CV optimization feature)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd resumate
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key (required for CV optimization)
# - JWT_SECRET: A secure random string for JWT tokens

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (if needed)
# Edit .env if you need to override API_URL

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

#### Backend (.env)
```
# Database
MONGODB_URI=mongodb://localhost:27017/resumate

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# OpenAI (Required for CV optimization)
OPENAI_API_KEY=sk-your-openai-api-key-here
# Optional: Change the model or max tokens
# OPENAI_MODEL=gpt-4
# OPENAI_MAX_TOKENS=3000

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env, optional)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Features

- ✅ User authentication and registration
- ✅ Resume upload and text extraction (PDF support)
- ✅ AI-powered resume optimization
- ✅ Job description input and matching
- ✅ Multiple resume templates
- ✅ PDF export
- ✅ Resume history and version management
- ✅ Skills gap analysis
- ✅ ATS compatibility checking

## 🔑 Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Create a new API key
5. Add the key to your `.env` file as `OPENAI_API_KEY`

## 🏗️ Project Structure

```
resumate/
├── backend/
│   ├── config/          # Database and configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Authentication and logging
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, PDF generation, etc.)
│   ├── scripts/         # Utility scripts
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── i18n/        # Internationalization
│   └── package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### CV Management
- `POST /api/cv/generate` - Generate optimized CV
- `POST /api/cv/create-from-scratch` - Create CV from scratch
- `GET /api/cv/history` - Get user's CV history
- `GET /api/cv/:id` - Get specific CV

### Upload & Processing
- `POST /api/upload/extract` - Extract text from PDF

### Templates
- `GET /api/templates` - Get available templates

## 🧠 How It Works

1. **Upload Resume**: User uploads their current resume (PDF format)
2. **Enter Job Description**: User pastes the job description they're targeting
3. **AI Optimization**: The system uses OpenAI to optimize the resume for the specific job
4. **Choose Template**: User selects a professional template for the final resume
5. **Download**: User downloads the optimized resume as PDF

## 📊 Technical Stack

### Backend
- Node.js / Express.js
- MongoDB with Mongoose
- OpenAI API for CV optimization
- Puppeteer for PDF generation
- Multer for file uploads
- Tesseract.js for OCR

### Frontend
- React 18
- Vite
- Tailwind CSS
- Shadcn/ui components
- i18n for internationalization
- Axios for API calls

## 🐛 Troubleshooting

### "Error while optimizing CV"
- Ensure `OPENAI_API_KEY` is set in your `.env` file
- Verify your API key is valid and has sufficient credits
- Check that CV text is at least 50 characters
- Ensure job description is at least 20 characters

### MongoDB Connection Error
- Verify MongoDB is running (`mongod` command)
- Check `MONGODB_URI` is correct in `.env`
- Ensure MongoDB is accessible at the specified address

### CORS Errors
- Check `FRONTEND_URL` matches your frontend's origin
- Verify the backend CORS middleware is properly configured

## 📄 License

This project is part of a bachelor's thesis on resume personalization platforms.

## 👤 Author

Ali - Bachelor's Thesis Project (2025)
