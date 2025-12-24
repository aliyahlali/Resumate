# Setup Instructions - Resumate Backend

## Quick Start Guide

### 1. Copy Environment Configuration

```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file and update the following variables:

#### **Required Configuration:**

```env
# Database connection (local MongoDB)
MONGODB_URI=mongodb://localhost:27017/resumate

# JWT secret (generate a random string)
JWT_SECRET=your-secure-random-string-here

# OpenAI API Key (REQUIRED for CV optimization)
OPENAI_API_KEY=sk-your-api-key-here
```

#### **Getting Your OpenAI API Key:**

1. Visit https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy the key and paste it into `.env`
4. Keep it safe - don't share it!

#### **Optional Configuration:**

```env
# Change OpenAI model (default: gpt-3.5-turbo)
OPENAI_MODEL=gpt-4

# Adjust token limit for longer CVs
OPENAI_MAX_TOKENS=3000

# Server port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

**Windows (using MongoDB Community):**
```bash
# If installed as a service, it should start automatically
# Or run mongod manually from MongoDB bin directory
```

**Mac (using Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server should start on `http://localhost:5000`

You should see output like:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
```

## ✅ Troubleshooting

### Error: "OPENAI_API_KEY environment variable is not set"

**Solution:** Make sure your `.env` file has the correct API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### Error: "OpenAI API key is not configured"

This appears in the UI when trying to generate a CV. The error message tells you:
- Your OpenAI API key is missing or invalid
- Add or verify your key in the `.env` file
- Restart the backend server after updating `.env`

### MongoDB Connection Error

Ensure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh  # This should open MongoDB shell if running

# If it doesn't work, start MongoDB:
# Windows: Search for "MongoDB" in Services and enable it
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Port Already in Use

If port 5000 is already in use:
```bash
# Change PORT in .env file
PORT=5001

# Then restart the server
npm run dev
```

## 🔍 Verification

Once the server is running, test it:

```bash
# In a new terminal, test the API
curl http://localhost:5000

# Expected response:
# {
#   "success": true,
#   "message": "Resumate Backend API is running",
#   "version": "1.0.0"
# }
```

## 📚 Next Steps

1. Start the frontend: `cd frontend && npm run dev`
2. Open http://localhost:5173 in your browser
3. Register a new account
4. Try uploading a resume and optimizing it with a job description
