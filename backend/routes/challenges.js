import { Router } from 'express';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants', 'name email')
      .sort({ startDate: -1 })
      .limit(50);
    res.json(challenges);
  } catch (err) {
    console.error('Get challenges error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch challenges' });
  }
});

// POST /api/challenges
router.post('/', async (req, res) => {
  try {
    const { title, description, rewardXP, startDate, endDate, type } = req.body;
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      rewardXP: rewardXP || 100,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type: type || 'weekly',
      status: new Date(startDate) > new Date() ? 'upcoming' : 'active',
    });

    res.status(201).json({ success: true, challenge });
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json({ success: false, message: 'Failed to create challenge' });
  }
});

// POST /api/challenges/join/:challengeId
router.post('/join/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(challengeId) || !isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid IDs' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.participants.includes(userId)) {
      return res.json({ success: true, message: 'Already joined', challenge });
    }

    challenge.participants.push(userId);
    await challenge.save();

    res.json({ success: true, message: 'Joined challenge', challenge });
  } catch (err) {
    console.error('Join challenge error:', err);
    res.status(500).json({ success: false, message: 'Failed to join challenge' });
  }
});

// PATCH /api/challenges/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid IDs' });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (!challenge.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User not in challenge' });
    }

    // Award XP
    const user = await User.findById(userId);
    if (user) {
      user.xp = (user.xp || 0) + challenge.rewardXP;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Challenge completed',
      xpEarned: challenge.rewardXP,
      totalXP: user?.xp || 0,
    });
  } catch (err) {
    console.error('Complete challenge error:', err);
    res.status(500).json({ success: false, message: 'Failed to complete challenge' });
  }
});

export default router;

