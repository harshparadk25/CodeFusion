import mongoose from 'mongoose';
import Message from '../models/message.model.js';
import Project from '../models/project.model.js';

export const assertProjectMember = async ({ projectId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID');
  }
  const project = await Project.findById(projectId).select('_id users').lean();
  if (!project) throw new Error('Project not found');
  const isMember = project.users.some((id) => id.toString() === userId.toString());
  if (!isMember) throw new Error('User is not a member of the project');
  return project;
};

export const saveTextMessage = async ({ projectId, senderId, text }) => {
  if (!text || text.trim() === '') throw new Error('Message text cannot be empty');
  const msg = await Message.create({
    project: projectId,
    sender: senderId,
    type: 'text',
    text: text.trim(),
  });
  return msg;
};

export const saveAIMessage = async ({ projectId, text = '', file = null, meta = {} }) => {
  if (!text && !file) throw new Error('AI message must include text or file');
  const msg = await Message.create({
    project: projectId,
    sender: null, 
    type: 'ai',
    text: text?.trim() || '',
    file: file
      ? {
          name: file.name,
          content: file.content,
        }
      : undefined,
    meta,
  });
  return msg;
};

export const saveFileMessage = async ({ projectId, senderId, file }) => {
  if (!file?.name || !file?.content) throw new Error('File name and content cannot be empty');
  const msg = await Message.create({
    project: projectId,
    sender: senderId,
    type: 'file',
    file: {
      name: file.name,
      content: file.content,
    },
  });
  return msg;
};

export const getProjectMessages = async ({ projectId, limit = 25, before }) => {
  const filter = { project: projectId };
  if (before) filter.createdAt = { $lt: new Date(before) };

  const items = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sender', 'username email')
    .lean();

  return {
    items,
    nextCursor: items.length === limit ? items[items.length - 1].createdAt : null,
  };
};
