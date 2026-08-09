# ⚡ CodeFusion

> **An AI-powered collaborative development platform for managing projects, repositories, real-time communication, and AI-assisted coding.**

CodeFusion is a full-stack JavaScript application designed to bring essential software-development workflows into a single platform. It combines **project management, repository handling, real-time collaboration, messaging, and AI-assisted development** through a modern React and Node.js architecture.

The application demonstrates how a scalable full-stack system can integrate **REST APIs, authentication, database persistence, WebSockets, external APIs, and AI services** into one cohesive platform.

---

## 🚀 Features

### 👤 Authentication & User Management

* User registration and login
* JWT-based authentication
* Protected routes
* User profile management
* Secure API access

### 📁 Project Management

* Create and manage projects
* Add collaborators to projects
* Project-specific workspace
* Manage project-related files and resources
* Project-based access control

### 🌳 Repository & File Management

* Repository integration
* File-tree based project explorer
* Create and manage project files
* Open files in an integrated editor
* Maintain multiple opened files
* Code-focused development workspace

### 💬 Real-Time Collaboration

CodeFusion uses **Socket-based communication** to provide real-time project collaboration.

* Real-time messaging
* Project-specific communication
* Live message delivery
* Socket authentication
* Connected-user/project handling

### 🤖 AI-Assisted Development

CodeFusion integrates AI into the development workflow.

The AI functionality can assist with:

* Code generation
* Code-related prompts
* Generating project files
* Creating file structures
* AI-assisted development tasks

Generated code can be integrated into the project's file tree, allowing developers to continue working on AI-generated files directly inside the workspace.

### 🎨 Modern UI

The frontend is built with:

* React
* Vite
* Tailwind CSS
* shadcn/ui
* Framer Motion

The interface focuses on a **dark, futuristic developer experience** with animated interactions and a code-editor-inspired workspace.

---

# 🛠️ Tech Stack

| Category        | Technologies             |
| --------------- | ------------------------ |
| Frontend        | React, Vite, JavaScript  |
| Styling         | Tailwind CSS, shadcn/ui  |
| Animations      | Framer Motion            |
| Backend         | Node.js, Express         |
| Database        | MongoDB / MongoDB Atlas  |
| Authentication  | JWT                      |
| Real-Time       | Socket.io                |
| AI              | External AI API          |
| HTTP Client     | Axios                    |
| Version Control | Git / GitHub             |
| Deployment      | Vercel / Node.js hosting |

---

# 🏗️ Architecture

CodeFusion follows a traditional **client-server architecture**.

```text
                    ┌─────────────────────┐
                    │      User           │
                    │  Browser / Client   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
          ┌────────────────┐       ┌────────────────┐
          │   REST APIs    │       │   Socket.io    │
          │    HTTP        │       │  Real-time     │
          └───────┬────────┘       └───────┬────────┘
                  │                         │
                  └────────────┬────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ Controllers│   │   Models   │   │ AI Service │
       └─────┬──────┘   └─────┬──────┘   └────────────┘
             │                │
             └────────┬───────┘
                      ▼
              ┌────────────────┐
              │    MongoDB     │
              │   Database     │
              └────────────────┘
```

---

# 📂 Project Structure

```text
CodeFusion/
│
├── backend/
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── project.controller.js
│   │   ├── repo.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── project.routes.js
│   │   ├── repo.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── user.models.js
│   │   ├── project.model.js
│   │   ├── commit.models.js
│   │   ├── message.model.js
│   │   └── ...
│   │
│   ├── middlewear/
│   │   ├── auth.middleware.js
│   │   └── ...
│   │
│   ├── db/
│   │   └── db.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── context/
│   │   ├── config/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── temp.md
```

---

# 🔄 How CodeFusion Works

A typical request follows this flow:

```text
User Action
     │
     ▼
React Component
     │
     ▼
Axios / HTTP Request
     │
     ▼
Express Route
     │
     ▼
Controller
     │
     ▼
Model / Service
     │
     ▼
MongoDB
     │
     ▼
Controller Response
     │
     ▼
React UI Update
```

For real-time functionality:

```text
User A
  │
  │ Socket Event
  ▼
Socket.io Server
  │
  │ Broadcast
  ▼
User B
  │
  ▼
Real-time UI Update
```

For AI functionality:

```text
User Prompt
     │
     ▼
React Frontend
     │
     ▼
AI API Route
     │
     ▼
AI Controller
     │
     ▼
External AI Provider
     │
     ▼
Generated Response
     │
     ▼
Frontend
     │
     ▼
File Tree / Editor
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **Git**
* **MongoDB / MongoDB Atlas**
* An API key for the configured AI provider

Check your Node.js installation:

```bash
node --version
npm --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/harshparadk25/CodeFusion.git
cd CodeFusion
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_ai_api_key

GITHUB_TOKEN=your_github_token
```

> **Important:** Environment variable names may differ depending on the current backend implementation. Check the backend source code before adding production credentials.

Start the backend:

```bash
npm start
```

If no start script is configured:

```bash
node server.js
```

The backend should now be available on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The exact URL will also be displayed in the Vite terminal output.

---

# 🔐 Environment Variables

Never commit secrets directly to GitHub.

Your `.env` file should be added to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
dist/
```

A recommended `.env.example`:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=
GITHUB_TOKEN=
```

This allows other developers to understand which environment variables are required without exposing credentials.

---

# 📡 API Structure

CodeFusion organizes backend functionality using **Routes → Controllers → Models**.

### Authentication & Users

```text
routes/user.routes.js
        │
        ▼
controllers/user.controller.js
        │
        ▼
models/user.models.js
```

Handles:

* Registration
* Login
* Authentication
* User operations

---

### Projects

```text
routes/project.routes.js
        │
        ▼
controllers/project.controller.js
        │
        ▼
models/project.model.js
```

Handles:

* Project creation
* Project retrieval
* Collaborators
* Project-related operations

---

### Repositories

```text
routes/repo.routes.js
        │
        ▼
controllers/repo.controller.js
        │
        ▼
Repository / GitHub integration
```

Handles repository-related functionality.

---

### Messaging

```text
routes/message.routes.js
        │
        ▼
controllers/message.controller.js
        │
        ▼
models/message.model.js
```

Handles persistent messaging functionality.

Real-time communication is handled separately through:

```text
socket.js
```

---

### AI

```text
routes/ai.routes.js
        │
        ▼
controllers/ai.controller.js
        │
        ▼
External AI Provider
```

Handles AI-assisted development functionality.

---

# 🔌 Real-Time Communication

CodeFusion uses Socket.io to support real-time collaboration.

The socket layer is responsible for:

* Establishing socket connections
* Authenticating users
* Associating sockets with projects
* Sending messages
* Receiving messages
* Broadcasting project events
* Handling connection/disconnection

The primary files to understand are:

```text
backend/server.js
backend/socket.js
```

---

# 🤖 AI-Assisted Coding

One of the major features of CodeFusion is its AI-assisted development workflow.

A user can provide a development prompt, which is sent to the backend AI controller.

The AI response can contain:

```text
File structure
      +
File names
      +
Generated source code
```

The frontend can then use this response to update the project's file tree.

Example:

```text
Project
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Button.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

This creates a development experience where AI-generated code can become part of the project's workspace rather than remaining only as a chat response.

---

# 🧪 Production Build

## Frontend

Create a production build:

```bash
cd frontend
npm run build
```

Preview it locally:

```bash
npm run preview
```

The generated production files are placed in:

```text
frontend/dist/
```

---

# 🚀 Deployment

## Frontend

The frontend can be deployed to platforms such as:

* Vercel
* Netlify
* Other static hosting platforms

Make sure the frontend's API configuration points to the deployed backend rather than:

```text
localhost
```

---

## Backend

The Node.js backend can be deployed using platforms such as:

* Render
* Railway
* AWS
* Docker-based hosting
* Other Node.js-compatible platforms

Production environment variables must be configured on the hosting platform.

---

# 🧑‍💻 Interview Walkthrough

If you're demonstrating CodeFusion during an interview, don't try to explain the entire repository.

A strong walkthrough is:

### 1. Start with the architecture

Explain:

```text
React → REST API → Express → Controllers → MongoDB
                         │
                         ├── Socket.io
                         │
                         └── AI Service
```

---

### 2. Show Authentication

Start with:

```text
user.routes.js
       ↓
user.controller.js
       ↓
JWT
       ↓
auth middleware
```

Explain how authenticated requests are protected.

---

### 3. Show a Complete Feature

Pick **Projects** and trace one request:

```text
React component
      ↓
Axios request
      ↓
Project route
      ↓
Project controller
      ↓
Project model
      ↓
MongoDB
      ↓
Response
      ↓
React UI
```

This demonstrates that you understand the complete full-stack flow.

---

### 4. Show Real-Time Communication

Open:

```text
backend/socket.js
```

Explain:

* How sockets connect
* How authentication works
* How projects are associated with sockets
* How messages are emitted
* How other users receive them

---

### 5. Show AI Integration

Open:

```text
backend/controllers/ai.controller.js
```

Explain:

```text
User Prompt
     ↓
Frontend
     ↓
Backend AI Route
     ↓
AI Controller
     ↓
AI Provider
     ↓
Generated Code
     ↓
Frontend File Tree
```

This is one of the strongest parts of the project to discuss.

---

# 📌 Key Files

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `backend/server.js`        | Backend bootstrap and server initialization |
| `backend/app.js`           | Express configuration and middleware        |
| `backend/socket.js`        | Real-time Socket.io functionality           |
| `backend/controllers/`     | Application business logic                  |
| `backend/routes/`          | REST API definitions                        |
| `backend/models/`          | MongoDB data models                         |
| `backend/db/db.js`         | Database connection                         |
| `backend/middlewear/`      | Authentication/upload middleware            |
| `frontend/src/App.jsx`     | Frontend root component                     |
| `frontend/src/main.jsx`    | React application bootstrap                 |
| `frontend/src/screens/`    | Application pages                           |
| `frontend/src/components/` | Reusable UI components                      |

---

# 🐛 Troubleshooting

### MongoDB connection error

Check:

```env
MONGO_URI=...
```

Also verify that your MongoDB deployment allows connections from your current environment.

---

### Backend is not reachable

Check that the backend is running:

```bash
npm start
```

Then verify the configured port.

Example:

```text
http://localhost:5000
```

Also verify that the frontend is using the correct backend API URL.

---

### AI requests are failing

Check:

```env
OPENAI_API_KEY=...
```

Also verify:

* API key validity
* Provider configuration
* API quota
* Model configuration
* Backend environment variables

---

### Port already in use

Change the backend port:

```env
PORT=5001
```

Then update the frontend API configuration accordingly.

---

# 🔮 Future Improvements

Potential improvements for CodeFusion include:

* [ ] Integrated browser-based code execution
* [ ] Git commit and push directly from the workspace
* [ ] Pull request management
* [ ] Branch management
* [ ] Advanced collaborative code editing
* [ ] Presence indicators
* [ ] AI code review
* [ ] AI debugging assistant
* [ ] AI-powered repository analysis
* [ ] Better project-level permissions
* [ ] File version history
* [ ] Automated testing integration
* [ ] Docker-based deployment
* [ ] CI/CD pipeline
* [ ] Improved observability and logging

---

# 📊 Learning & Engineering Concepts Demonstrated

CodeFusion demonstrates practical experience with:

* Full-stack application architecture
* REST API design
* React component architecture
* Node.js and Express
* MongoDB data modeling
* JWT authentication
* Middleware
* CRUD operations
* Real-time communication
* WebSockets / Socket.io
* External API integration
* AI API integration
* File-tree management
* State management
* Frontend/backend communication
* Environment configuration
* Git/GitHub workflow
* Deployment concepts

---

# ⭐ Why CodeFusion?

Most development tools separate communication, project management, repositories, and AI assistance across multiple applications.

CodeFusion explores the idea of bringing these workflows together:

```text
                 ┌──────────────────┐
                 │    CodeFusion    │
                 └────────┬─────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   Projects         Collaboration       AI Coding
        │                 │                 │
        ▼                 ▼                 ▼
   Repositories        Messaging       Code Generation
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  Developer Workspace
```

The goal is to provide developers with a single collaborative environment where they can **create projects, manage code, communicate with collaborators, and use AI to accelerate development**.

---

# 📄 License

This project is intended primarily as a learning, portfolio, and demonstration project.

If you plan to reuse or distribute the project, add an appropriate license such as MIT.

---

# 👨‍💻 Author

**Harsh Paradkar**

GitHub: [@harshparadk25](https://github.com/harshparadk25)

---

## ⭐ Show Your Support

If you found CodeFusion interesting, consider giving the repository a ⭐ on GitHub.
