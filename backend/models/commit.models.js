import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'upload'],
      required: true,
    },
    message: { type: String, default: '' },
    file: {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
      path: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Commit', commitSchema);
