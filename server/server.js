
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connect from "./db/db.js";
import {Server} from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";



app.use(cors());

const port = process.env.PORT || 3000;


const server = http.createServer(app);
connect();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization;
const token = socket.handshake.auth?.token 
           || socket.handshake.headers?.authorization?.split(" ")[1]
           || socket.handshake.query?.token;

           const projectId = socket.handshake.query?.projectId;

           if(!mongoose.Types.ObjectId.isValid(projectId)) {
               throw new Error("Invalid project ID");
           }

           socket.projectId = await Project.findById(projectId).select("_id").lean();

    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) throw new Error("Invalid token");

    socket.user = decoded;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);
  socket.join(socket.projectId._id.toString());

  socket.on("project-message", async (msg) => {
  console.log("📩 Received from client:", msg);

  const message = typeof msg.message === "string" ? msg.message.trim() : "";


  const aiIsPresent = message.includes("@ai");

   const payload = {
    sender: {
      _id: socket.user._id,       
      email: socket.user.email,   
    },
    message: msg.message,  
  };

  if(aiIsPresent){
    const prompt =message.replace("@ai","").trim();
    const result = await generateResult(prompt);

    io.to(socket.projectId._id.toString()).emit("message", {
      type: "ai",
      sender: {
        _id: "ai",
        email: "AI Bot",
      },
      file:{
        name:`ai-result-${Math.floor(performance.now())}.js`,
        content:result,
      }
    });

    return;
  }
  socket.to(socket.projectId._id.toString()).emit("message", payload);


});

socket.on("file-update", (data) => {
  try {
    const { fileName, content } = data;

    // Broadcast to everyone in the project room except sender
    socket.to(socket.projectId._id.toString()).emit("file-updated", {
      fileName,
      content,
      updatedBy: socket.user.email,
    });
  } catch (err) {
    console.error("File update error:", err);
  }
});





  // Test listener
  socket.on("pingServer", (msg) => {
    console.log("📩 Received from client:", msg);
    socket.emit("pongClient", { reply: "Hello from server!" });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    socket.leave(socket.projectId._id.toString());
  });
});


server.listen(port, () => console.log(`🚀 Server running on port ${port}`));
export default server;
