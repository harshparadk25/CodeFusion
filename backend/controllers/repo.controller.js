import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Commit from '../models/commit.models.js';
import { getIO } from '../socket.js';
import { getBucket } from '../services/gridfs.services.js';

async function assertMember(projectId, userId) {
  const project = await Project.findById(projectId).select('users').lean();
  if (!project) throw new Error('Project not found');
  const isMember = project.users.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isMember) {
    throw new Error("User is not a member of the project");
  }
  return project;
}

function broadcastCommit(projectId, event, payload) {
  const io = getIO();
  if (io) io.to(projectId.toString()).emit(event, payload);
}

export const uploadFileController = async (req, res) => {
  const { projectId } = req.params;
  const { message = '', path = '' } = req.body;
  
  await assertMember(projectId, req.user._id);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const bucket = getBucket();
  const resultFiles = [];

  for (const file of req.files) {
    const uploadStream = bucket.openUploadStream(file.originalname, {
      metadata: {
        uploader: req.user._id,
        project: new mongoose.Types.ObjectId(projectId),
        path,
      },
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    const fileDoc = await new Promise((resolve, reject) => {
  uploadStream.on('finish', async () => {
    try {
      
      const bucket = getBucket();
      const cursor = bucket.find({ _id: uploadStream.id });
      const files = await cursor.toArray();
      resolve(files[0]);
    } catch (err) {
      reject(err);
    }
  });

  uploadStream.on('error', reject);
});


    console.log("Uploaded file saved:", fileDoc.filename, fileDoc._id);



    const commit = await Commit.create({
      project: projectId,
      author: req.user._id,
      action: 'upload',
      message,
      file: {
        _id: fileDoc._id,
        name: fileDoc.filename,
        path,
      },
    });

    const payload = {
      action: 'upload',
      file: { _id: fileDoc._id, name: fileDoc.filename, path },
      commit,
    };
    broadcastCommit(projectId, 'new-commit', payload);
    resultFiles.push(payload);
  }

  res.status(201).json({ items: resultFiles });
  console.log("FILES:", req.files);
console.log("BODY:", req.body);



};

export const createTextFileController = async (req, res) => {
  const { projectId } = req.params;
  const { filename, content = '', path = '', message = '' } = req.body;
  if (!filename) return res.status(400).json({ error: 'filename is required' });

  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: {
      uploader: req.user._id,
      project: new mongoose.Types.ObjectId(projectId),
      path,
      isText: true,
    },
    contentType: 'text/plain; charset=utf-8',
  });

  uploadStream.end(Buffer.from(content, 'utf-8'));

  const fileDoc = await new Promise((resolve, reject) => {
  uploadStream.on('finish', async () => {
    try {
      
      const bucket = getBucket();
      const cursor = bucket.find({ _id: uploadStream.id });
      const files = await cursor.toArray();
      resolve(files[0]);
    } catch (err) {
      reject(err);
    }
  });

  uploadStream.on('error', reject);
});


  const commit = await Commit.create({
    project: projectId,
    author: req.user._id,
    action: 'create',
    message,
    file: {
      _id: fileDoc._id,
      name: fileDoc.filename,
      path,
    },
  });

  const payload = {
    action: 'create',
    file: { _id: fileDoc._id, name: fileDoc.filename, path },
    commit,
  };
  broadcastCommit(projectId, 'file-added', payload);
  res.status(201).json(payload);
};


export const updateTextFileController = async (req, res) => {
  const { projectId, fileId } = req.params;
  const { content, message = '' } = req.body;
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content (string) is required' });
  }

  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const cursor = bucket.find({
    _id: new mongoose.Types.ObjectId(fileId),
    'metadata.project': new mongoose.Types.ObjectId(projectId),
  });
  const fileDocs = await cursor.toArray();
  if (!fileDocs || fileDocs.length === 0) return res.status(404).json({ error: 'File not found' });

  const prev = fileDocs[0];

  await bucket.delete(new mongoose.Types.ObjectId(fileId));

  
  const uploadStream = bucket.openUploadStreamWithId(
  new mongoose.Types.ObjectId(fileId),  
  prev.filename,
  {
    metadata: {
      ...prev.metadata,
      updatedBy: req.user._id,
    },
    contentType: prev.contentType || 'text/plain; charset=utf-8',
  }
);

  uploadStream.end(Buffer.from(content, 'utf-8'));

   const newFileDoc = await new Promise((resolve, reject) => {
      uploadStream.on('finish', async () => {
        try {
          const cursor = bucket.find({ _id: uploadStream.id });
          const files = await cursor.toArray();
          resolve(files[0]);
        } catch (err) {
          reject(err);
        }
      });
      uploadStream.on('error', reject);
    });

    if (!newFileDoc) {
      return res.status(500).json({ error: 'Failed to retrieve uploaded file info' });
    }

  const commit = await Commit.create({
    project: projectId,
    author: req.user._id,
    action: 'update',
    message,
    file: {
      _id: newFileDoc._id,
      name: newFileDoc.filename,
      path: newFileDoc.metadata?.path || '',
    },
  });

  const payload = {
    action: 'update',
    file: {
      _id: newFileDoc._id,
      name: newFileDoc.filename,
      path: newFileDoc.metadata?.path || '',
    },
    commit,
  };
  broadcastCommit(projectId, 'file-updated', payload);
  res.status(200).json(payload);
};

export const deleteFileController = async (req, res) => {
  const { projectId, fileId } = req.params;
  const { message = '' } = req.body;
  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const cursor = bucket.find({
    _id: new mongoose.Types.ObjectId(fileId),
    'metadata.project': new mongoose.Types.ObjectId(projectId),
  });
  const fileDocs = await cursor.toArray();
  if (!fileDocs || fileDocs.length === 0) return res.status(404).json({ error: 'File not found' });

  const file = fileDocs[0];

  await bucket.delete(file._id);

  const commit = await Commit.create({
    project: projectId,
    author: req.user._id,
    action: 'delete',
    message,
    file: {
      _id: file._id,
      name: file.filename,
      path: file.metadata?.path || '',
    },
  });

  const payload = {
    action: 'delete',
    file: { _id: file._id, name: file.filename, path: file.metadata?.path || '' },
    commit,
  };
  broadcastCommit(projectId, 'file-deleted', payload);
  res.status(200).json(payload);
};

export const listFilesController = async (req, res) => {
  const { projectId } = req.params;
  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const cursor = bucket
    .find({ 'metadata.project': new mongoose.Types.ObjectId(projectId) })
    .sort({ uploadDate: -1 });
  const files = await cursor.toArray();

  res.json(
    files.map((f) => ({
      _id: f._id,
      filename: f.filename,
      path: f.metadata?.path || '',
      uploadDate: f.uploadDate,
      uploader: f.metadata?.uploader,
      contentType: f.contentType,
    }))
  );
};

export const downloadFileController = async (req, res) => {
  const { projectId, fileId } = req.params;
  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const cursor = bucket.find({
    _id: new mongoose.Types.ObjectId(fileId),
    'metadata.project': new mongoose.Types.ObjectId(projectId),
  });
  const fileDocs = await cursor.toArray();
  if (!fileDocs || fileDocs.length === 0) return res.status(404).json({ error: 'File not found' });

  const f = fileDocs[0];
  res.setHeader('Content-Type', f.contentType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${f.filename}"`);
  bucket.openDownloadStream(f._id).pipe(res);
};

export const getFileContentController = async (req, res) => {
  const { projectId, fileId } = req.params;
  await assertMember(projectId, req.user._id);

  const bucket = getBucket();
  const cursor = bucket.find({
    _id: new mongoose.Types.ObjectId(fileId),
    'metadata.project': new mongoose.Types.ObjectId(projectId),
  });
  const fileDocs = await cursor.toArray();
  if (!fileDocs || fileDocs.length === 0) return res.status(404).json({ error: 'File not found' });

  const f = fileDocs[0];
  const stream = bucket.openDownloadStream(f._id);

  let data = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => (data += chunk));
  stream.on('end', () =>
    res.json({
      _id: f._id,
      filename: f.filename,
      path: f.metadata?.path || '',
      contentType: f.contentType,
      content: data,
    })
  );
  stream.on('error', (e) => res.status(500).json({ error: e.message }));
};

export const listCommitsController = async (req, res) => {
  const { projectId } = req.params;
  await assertMember(projectId, req.user._id);

  const items = await Commit.find({ project: projectId })
    .sort({ createdAt: -1 })
    .populate('author', '_id username email')
    .lean()
    .limit(100);

  res.json({ items });
};
