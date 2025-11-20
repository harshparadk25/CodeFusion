import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import connect from './db/db.js';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Project from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
import { saveAIMessage, saveFileMessage, saveTextMessage } from './services/message.services.js';
import { setIO } from './socket.js';
import { initBucket } from './services/gridfs.services.js';

app.use(
  cors({
    origin: [process.env.ADMIN_URL, process.env.CLIENT_URL],
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

const server = http.createServer(app);
connect();

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
  initBucket();
});

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setIO(io);

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1] ||
      socket.handshake.query?.token;

    const projectId = socket.handshake.query?.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }

    const project = await Project.findById(projectId).select('_id').lean();
    if (!project) return next(new Error('Project not found'));

    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw new Error('Invalid token');

    socket.projectId = project;
    socket.user = decoded; 

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  onlineUsers.set(socket.user._id, true);
  socket.join(socket.projectId._id.toString());

  io.to(socket.projectId._id.toString()).emit('online-users', Array.from(onlineUsers.keys()));
  console.log('🔌 A user connected:', socket.id);

  socket.on('project-message', async (msg) => {
    try {
      const raw = typeof msg?.message === 'string' ? msg.message : '';
      const message = raw.trim();
      const filePayload = msg?.file; 

     
      if (filePayload?.name && filePayload?.content) {
        const savedFileMsg = await saveFileMessage({
          projectId: socket.projectId._id,
          senderId: socket.user._id,
          file: {
            name: filePayload.name,
            content: filePayload.content,
          },
        });

        io.to(socket.projectId._id.toString()).emit('message', {
          _id: savedFileMsg._id,
          type: 'file',
          sender: { _id: socket.user._id, email: socket.user.email },
          file: savedFileMsg.file,
          createdAt: savedFileMsg.createdAt,
        });
        return;
      }

      
      if (message.includes('@ai')) {
        const prompt = message.replace('@ai', '').trim();
        const result = await generateResult(prompt);

        
        const aiFilename = `ai-result-${Date.now()}.js`;
        const savedAI = await saveAIMessage({
          projectId: socket.projectId._id,
          text: `AI generated code for: ${prompt}`,
          file: { name: aiFilename, content: result },
          meta: { prompt },
        });

        io.to(socket.projectId._id.toString()).emit('message', {
          _id: savedAI._id,
          type: 'ai',
          sender: { _id: 'ai', email: 'AI Bot' },
          message: savedAI.text,
          file: savedAI.file,
          createdAt: savedAI.createdAt,
        });
        return;
      }

      
      if (message.length > 0) {
        const savedText = await saveTextMessage({
          projectId: socket.projectId._id,
          senderId: socket.user._id,
          text: message,
        });

        io.to(socket.projectId._id.toString()).emit('message', {
          _id: savedText._id,
          type: 'text',
          sender: { _id: socket.user._id, email: socket.user.email },
          message: savedText.text,
          createdAt: savedText.createdAt,
        });
      }
    } catch (err) {
      console.error('❌ Chat save error:', err);
      socket.emit('message-error', { message: err.message || 'Failed to send message' });
    }
  });

  socket.on('file-update', (data) => {
    try {
      const { fileName, content } = data || {};
      socket.to(socket.projectId._id.toString()).emit('file-updated', {
        fileName,
        content,
        updatedBy: socket.user.email,
      });
    } catch (err) {
      console.error('❌ File update error:', err);
    }
  });

  socket.on('pingServer', (msg) => {
    console.log('📩 Received from client:', msg);
    socket.emit('pongClient', { reply: 'Hello from server!' });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.user._id);
    io.to(socket.projectId._id.toString()).emit('online-users', Array.from(onlineUsers.keys()));
    console.log('❌ A user disconnected:', socket.id);
    socket.leave(socket.projectId._id.toString());
  });
});

server.listen(port, () => console.log(`🚀 Server running on port ${port}`));
export default server;
