import { Router } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/', async (req, res) => {
  try {
    const items = await Post.find()
      .populate('authorId', 'name email profileImageUrl')
      .populate('comments.userId', 'name email profileImageUrl')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(items);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { author, authorId, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ success: false, message: 'Author and content required' });
    }
    const item = await Post.create({ author, authorId, content });
    res.status(201).json(item);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// POST /api/community/:postId/comment
router.post('/:postId/comment', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, author, content } = req.body;

    if (!isValidObjectId(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }

    if (!userId || !author || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({ userId, author, content });
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

// PATCH /api/community/:postId/react
router.patch('/:postId/react', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, reactionType } = req.body; // 'like', 'fire', 'trophy'

    if (!isValidObjectId(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }

    if (!userId || !reactionType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!['like', 'fire', 'trophy'].includes(reactionType)) {
      return res.status(400).json({ success: false, message: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Convert userId to ObjectId for comparison
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(r => 
      r.userId && (r.userId.toString() === userId || r.userId.equals(userIdObj))
    );
    
    if (existingReactionIndex > -1) {
      const existingReaction = post.reactions[existingReactionIndex];
      // Remove existing reaction
      post.reactions.splice(existingReactionIndex, 1);
      
      // Decrement counter
      if (existingReaction.type === 'like') post.likes = Math.max(0, (post.likes || 0) - 1);
      if (existingReaction.type === 'fire') post.fire = Math.max(0, (post.fire || 0) - 1);
      if (existingReaction.type === 'trophy') post.trophy = Math.max(0, (post.trophy || 0) - 1);
    }

    // Add new reaction if it's different or didn't exist
    if (existingReactionIndex === -1 || post.reactions[existingReactionIndex]?.type !== reactionType) {
      post.reactions.push({ userId: userIdObj, type: reactionType });
      if (reactionType === 'like') post.likes = (post.likes || 0) + 1;
      if (reactionType === 'fire') post.fire = (post.fire || 0) + 1;
      if (reactionType === 'trophy') post.trophy = (post.trophy || 0) + 1;
    }

    await post.save();

    res.json({
      success: true,
      post: {
        likes: post.likes,
        fire: post.fire,
        trophy: post.trophy,
      },
    });
  } catch (err) {
    console.error('React to post error:', err);
    res.status(500).json({ success: false, message: 'Failed to react to post' });
  }
});

// GET /api/community/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name email xp profileImageUrl')
      .sort({ xp: -1 })
      .limit(10);
    
    res.json({ success: true, leaderboard: topUsers });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
});

export default router;
