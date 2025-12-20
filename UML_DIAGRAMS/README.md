# UML Diagrams for Resumate Project

This directory contains comprehensive UML diagrams for the Resumate project, a final year project (Projet de Fin d'Études).

## 📋 Diagrams Overview

### 1. **Class Diagram** (`01_Class_Diagram.puml`)
Shows the system's class structure including:
- Backend models (User, CVHistory)
- Backend services (OpenAI, CV Parser, HTML Generator, OCR)
- Backend controllers (Auth, CV, Upload)
- Frontend components and services
- Relationships between classes

### 2. **Use Case Diagram** (`02_Use_Case_Diagram.puml`)
Illustrates all use cases of the system:
- Authentication use cases (Register, Login, Logout)
- CV Generation use cases (Upload, Generate, Download)
- CV Management use cases (View History, Search, Sort)
- Internationalization use cases
- Administration use cases

### 3. **Sequence Diagram - CV Generation** (`03_Sequence_Diagram_CV_Generation.puml`)
Details the step-by-step process of CV generation:
- User interaction flow
- API calls and responses
- Service interactions
- Database operations

### 4. **Component Diagram** (`04_Component_Diagram.puml`)
Shows the system architecture:
- Client layer (React Frontend)
- API layer (Express Server)
- Business logic layer (Services)
- Data layer (MongoDB)
- External services (OpenAI API)

### 5. **Deployment Diagram** (`05_Deployment_Diagram.puml`)
Illustrates the deployment architecture:
- Client browser
- Web server
- Application server
- Database server
- External services
- File storage

### 6. **Activity Diagram - CV Generation** (`06_Activity_Diagram_CV_Generation.puml`)
Workflow diagram showing the CV generation process:
- Decision points
- User actions
- System processes
- Error handling

### 7. **State Diagram - User** (`07_State_Diagram_User.puml`)
Shows user authentication states:
- Not authenticated
- Authenticated
- Registration/Login processes
- State transitions

## 🛠️ How to View These Diagrams

### Option 1: PlantUML Online Editor
1. Go to [http://www.plantuml.com/plantuml/uml/](http://www.plantuml.com/plantuml/uml/)
2. Copy the content of any `.puml` file
3. Paste it into the editor
4. View the generated diagram

### Option 2: VS Code Extension
1. Install the "PlantUML" extension in VS Code
2. Open any `.puml` file
3. Press `Alt+D` to preview the diagram

### Option 3: PlantUML Server (Local)
1. Install PlantUML: `npm install -g node-plantuml`
2. Generate images: `puml generate *.puml`
3. View the generated PNG/SVG files

### Option 4: Online Tools
- [PlantText](https://www.planttext.com/)
- [PlantUML Web Server](http://www.plantuml.com/plantuml/)

## 📊 Diagram Formats

All diagrams are in PlantUML format (`.puml`), which can be:
- Converted to PNG, SVG, PDF
- Embedded in documentation
- Version controlled
- Easily modified

## 🎓 Project Information

**Project Name:** Resumate  
**Type:** Final Year Project (Projet de Fin d'Études)  
**Description:** AI-powered CV optimization and generation system  
**Technologies:**
- Frontend: React, Vite, Tailwind CSS, i18next
- Backend: Node.js, Express.js, MongoDB
- AI: OpenAI API / OpenRouter
- Authentication: JWT

## 📝 Notes

- All diagrams are in **English** as requested
- Diagrams follow UML 2.0 standards
- PlantUML syntax is used for easy modification
- Diagrams can be customized for your presentation needs

## 🔄 Updating Diagrams

To update any diagram:
1. Edit the corresponding `.puml` file
2. Use PlantUML syntax
3. Regenerate the visual representation
4. Update your documentation

## 📚 Additional Resources

- [PlantUML Documentation](https://plantuml.com/)
- [UML 2.0 Specification](https://www.omg.org/spec/UML/)
- [PlantUML Cheat Sheet](https://real-world-plantuml.com/)

---

**Generated for:** Resumate Final Year Project  
**Date:** December 2024  
**Language:** English


