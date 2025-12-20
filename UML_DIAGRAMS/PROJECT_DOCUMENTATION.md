# Resumate - Final Year Project Documentation

## 📋 Project Overview

**Project Name:** Resumate  
**Type:** Final Year Project (Projet de Fin d'Études)  
**Description:** AI-powered CV optimization and generation system using OpenAI API  
**Academic Year:** 2024-2025

## 🎯 Project Objectives

1. **AI-Powered CV Optimization**: Automatically optimize CVs based on job descriptions using OpenAI GPT models
2. **Multi-Template System**: Provide 4 professional CV templates for different industries
3. **OCR Integration**: Extract text from PDF, Word, and image files
4. **User Management**: Secure authentication and user profile management
5. **Internationalization**: Support for 4 languages (French, English, Lithuanian, Russian)
6. **CV History**: Track and manage all generated CVs

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Axios** - HTTP client
- **shadcn/ui** - UI component library

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

#### External Services
- **OpenAI API** - AI-powered CV optimization
- **OpenRouter** - Alternative AI API provider
- **OCR Services** - Text extraction from files

## 📊 UML Diagrams

This project includes comprehensive UML diagrams covering all aspects of the system:

### 1. Class Diagram
**File:** `01_Class_Diagram.puml`

Shows the complete class structure including:
- **Models**: User, CVHistory
- **Services**: OpenAI, CV Parser, HTML Generator, OCR
- **Controllers**: Auth, CV, Upload
- **Frontend Components**: Dashboard, GenerateCV, History
- **Relationships**: Associations, dependencies, compositions

**Key Classes:**
- `User`: Manages user authentication and profile
- `CVHistory`: Stores generated CVs
- `OpenAIService`: Handles AI optimization
- `CVParser`: Parses and structures CV data
- `HTMLGeneratorService`: Generates HTML templates

### 2. Use Case Diagram
**File:** `02_Use_Case_Diagram.puml`

Illustrates all system functionalities:
- **Authentication**: Register, Login, Logout, View Profile
- **CV Generation**: Upload file, Extract text, Generate CV, Download PDF
- **CV Management**: View history, Search, Sort, Delete
- **Internationalization**: Change language
- **Administration**: Manage users, View statistics

**Actors:**
- **User**: Regular application user
- **Admin**: System administrator

### 3. Sequence Diagram - CV Generation
**File:** `03_Sequence_Diagram_CV_Generation.puml`

Details the CV generation process:
1. User submits CV text and job description
2. System authenticates user
3. OpenAI API optimizes CV content
4. CV Parser extracts structured data
5. HTML Generator creates formatted CV
6. System saves to database
7. User receives generated CV

**Key Interactions:**
- Frontend ↔ Backend API
- Controller ↔ Services
- Services ↔ External APIs
- Services ↔ Database

### 4. Component Diagram
**File:** `04_Component_Diagram.puml`

Shows system architecture layers:
- **Client Layer**: React Frontend (Pages, Components, Services)
- **API Layer**: Express Server (Routes, Controllers, Middleware)
- **Business Logic Layer**: Services (OpenAI, Parser, Generator, OCR)
- **Data Layer**: MongoDB (Users, CV History)
- **External Services**: OpenAI API, OpenRouter

### 5. Deployment Diagram
**File:** `05_Deployment_Diagram.puml`

Illustrates production deployment:
- **Client Browser**: React application
- **Web Server**: Nginx/Apache serving static files
- **Application Server**: Node.js with Express
- **Database Server**: MongoDB
- **External Services**: OpenAI API, OpenRouter
- **File Storage**: Upload directory

### 6. Activity Diagram - CV Generation
**File:** `06_Activity_Diagram_CV_Generation.puml`

Workflow of CV generation process:
- Template selection
- File upload (optional) or manual text entry
- Job description input
- Validation
- AI optimization
- HTML generation
- Database storage
- User download/view

### 7. State Diagram - User
**File:** `07_State_Diagram_User.puml`

User authentication states:
- **Not Authenticated**: Initial state, limited access
- **Registering**: Account creation process
- **Logging In**: Authentication process
- **Authenticated**: Full system access
- **Viewing Pages**: Dashboard, Generate CV, History
- **Logging Out**: Session termination

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcryptjs for password encryption
3. **Protected Routes**: Middleware for route protection
4. **Input Validation**: Server-side validation
5. **CORS Configuration**: Cross-origin resource sharing control

## 🌍 Internationalization

The system supports 4 languages:
- 🇫🇷 French (default)
- 🇬🇧 English
- 🇱🇹 Lithuanian
- 🇷🇺 Russian

**Features:**
- Automatic language detection
- Language persistence in localStorage
- Instant language switching
- Complete UI translation

## 📈 Key Features

### 1. AI-Powered CV Optimization
- Analyzes job description
- Extracts keywords and requirements
- Optimizes CV content accordingly
- Adds metrics and achievements
- Enhances professional descriptions

### 2. Multi-Template System
- **Modern Professional**: Tech and business professionals
- **Clean Minimal**: Academic and research fields
- **Professional Classic**: Finance and consulting
- **Creative Modern**: Design and creative industries

### 3. OCR Text Extraction
- PDF file support
- Word document support (.doc, .docx)
- Image file support (PNG, JPG, JPEG)
- Automatic text extraction
- Text cleaning and formatting

### 4. CV Management
- Complete generation history
- Search functionality
- Sort by date
- View and download CVs
- Delete old CVs

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'client']),
  createdAt: Date
}
```

### CVHistory Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  originalCVText: String,
  jobDescription: String,
  optimizedCVText: String,
  cvHTML: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### CV Generation
- `POST /api/cv/generate` - Generate optimized CV
- `GET /api/cv/history` - Get user's CV history
- `GET /api/cv/:id` - Get specific CV

### File Upload
- `POST /api/upload/extract` - Extract text from file

## 📱 User Interface

### Pages
1. **Login/Register**: User authentication
2. **Dashboard**: Statistics and quick actions
3. **Generate CV**: Multi-step CV generation wizard
4. **History**: View and manage generated CVs

### Components
- Responsive design
- Modern UI with Tailwind CSS
- Loading states and animations
- Error handling and validation
- Language selector

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
- Frontend: Build static files with Vite
- Backend: Node.js server with PM2
- Database: MongoDB (local or Atlas)
- Web Server: Nginx for static files

## 📊 Project Statistics

- **Total Files**: ~100+
- **Lines of Code**: ~15,000+
- **Components**: 20+
- **API Endpoints**: 10+
- **Database Collections**: 2
- **Supported Languages**: 4
- **CV Templates**: 4

## 🎓 Academic Value

This project demonstrates:
- **Full-stack development** (React + Node.js)
- **AI integration** (OpenAI API)
- **Database design** (MongoDB)
- **Security implementation** (JWT, bcrypt)
- **Internationalization** (i18next)
- **File processing** (OCR, PDF, Word)
- **UI/UX design** (Modern, responsive)
- **Software engineering** (MVC architecture, separation of concerns)

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Installation guide
- `API_EXAMPLES.md` - API usage examples
- `UML_DIAGRAMS/` - All UML diagrams
- `TRADUCTIONS_RESUMATE.md` - Internationalization guide

## 🔄 Future Enhancements

1. **Real-time Collaboration**: Multiple users editing CVs
2. **CV Analytics**: Track CV performance
3. **Export Formats**: DOCX, LaTeX support
4. **AI Recommendations**: Career suggestions
5. **Template Customization**: User-created templates
6. **Mobile App**: React Native version
7. **Email Integration**: Send CVs via email
8. **LinkedIn Integration**: Import profile data

## 📞 Contact & Support

For questions about this project:
- Review the documentation files
- Check the UML diagrams
- Consult the code comments
- Refer to the API examples

---

**Project Status:** ✅ Complete  
**Documentation Status:** ✅ Complete  
**UML Diagrams:** ✅ Complete (7 diagrams)  
**Language:** English

**Prepared for:** Final Year Project Presentation  
**Date:** December 2024


