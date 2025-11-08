import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    trophy: { type: Number, default: 0 },
    reactions: [{ userId: mongoose.Schema.Types.ObjectId, type: String }], // 'like', 'fire', 'trophy'
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      author: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
