
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
import { Result } from "express-validator";


app.use(cors());

const port = process.env.PORT || 3000;

connect();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
      _id: socket.user._id,       // from JWT
      email: socket.user.email,   // from JWT
    },
    message: msg.message,         // only text
  };

  if(aiIsPresent){
    const prompt =message.replace("@ai","").trim();
    const result = await generateResult(prompt);

    io.to(socket.projectId._id.toString()).emit("message", {
      sender: {
        _id: "ai",
        email: "AI Bot",
      },
      message: result
    });

    return;
  }
  socket.to(socket.projectId._id.toString()).emit("message", payload);


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
