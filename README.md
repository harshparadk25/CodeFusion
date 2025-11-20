 CodeFusion  

A full-stack MERN application with real-time collaboration and AI-powered coding assistant.  

Users can:  
- Create and manage projects  
- Collaborate in real-time via **Socket.IO**  
- Chat with teammates and AI (`@ai` trigger)  
- Update and sync files instantly  
- Deployable on **Render (backend)** + **Vercel (frontend)**  

---

## ⚙️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, ShadCN, Framer Motion  
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO  
- **Database**: MongoDB Atlas  
- **Authentication**: JWT  
- **AI Services**: Custom AI service  
- **Deployment**: Render + Vercel  

---

## 📂 Project Structure

CodeFusion/
│── backend/ # Node.js + Express + Socket.IO
│── frontend/ # React + Vite + Tailwind + ShadCN
│── README.md

yaml
Copy code

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/codefusion.git
cd codefusion
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file inside backend/:

env
Copy code
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173
Run backend locally:

bash
Copy code
npm run dev
3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
Create a .env file inside frontend/:

env
Copy code
VITE_API_URL=http://localhost:3000/api
Run frontend locally:

bash
Copy code
npm run dev
🌐 Deployment
Backend (Render)
Push backend code to GitHub.

Create a Web Service on Render.

Add environment variables from your .env file.

Deploy → Get your backend URL (e.g. https://your-backend.onrender.com).

Frontend (Vercel)
Push frontend code to GitHub.

Import project on Vercel.

Add .env:

env
Copy code
VITE_API_URL=https://your-backend.onrender.com/api
Deploy → Get your frontend URL (e.g. https://your-frontend.vercel.app).

🔌 Socket.IO Usage
Connect with projectId + token:

js
Copy code
import { io } from "socket.io-client";

const socket = io("https://your-backend.onrender.com", {
  auth: { token: localStorage.getItem("token") },
  query: { projectId: "your_project_id" }
});
Send & receive messages:

js
Copy code
// Send message
socket.emit("project-message", { message: "Hello Team" });

// Receive message
socket.on("message", (data) => console.log("New message:", data));
🧑‍💻 Features
🔐 Secure JWT authentication

👥 Real-time collaboration with Socket.IO

🤖 AI bot (@ai) to generate code snippets/files

📁 Live file updates across connected users

⚡ Optimized for deployment

🛠️ Troubleshooting
CORS errors → Ensure backend cors allows both http://localhost:5173 (dev) and your Vercel frontend URL (prod).

API not working → Check VITE_API_URL in frontend .env.

Socket.IO auth issues → Confirm token and projectId are sent.

MongoDB errors → Ensure MONGO_URI is correct and Atlas IP whitelist includes 0.0.0.0/0 for testing.

📜 License
MIT License © 2025




