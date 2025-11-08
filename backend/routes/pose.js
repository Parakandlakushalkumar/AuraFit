import { Router } from 'express';
import mongoose from 'mongoose';
import PoseLog from '../models/PoseLog.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/pose/log
router.post('/log', async (req, res) => {
  try {
    const { userId, exercise, accuracy, duration, keypoints } = req.body;

    if (!userId || !exercise || typeof accuracy !== 'number') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    if (accuracy < 0 || accuracy > 100) {
      return res.status(400).json({ success: false, message: 'Accuracy must be between 0 and 100' });
    }

    const log = await PoseLog.create({
      userId,
      exercise,
      accuracy,
      duration,
      keypoints,
    });

    res.status(201).json({ success: true, log });
  } catch (err) {
    console.error('Pose log error:', err);
    res.status(500).json({ success: false, message: 'Failed to log pose data' });
  }
});

// GET /api/pose/logs/:userId
router.get('/logs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const logs = await PoseLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ success: true, logs });
  } catch (err) {
    console.error('Get pose logs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pose logs' });
  }
});

export default router;

