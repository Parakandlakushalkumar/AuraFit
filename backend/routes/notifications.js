import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import WorkoutLog from '../models/WorkoutLog.js';
import MealLog from '../models/MealLog.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Motivational quotes
const MOTIVATIONAL_QUOTES = [
  "Every workout counts! Keep pushing forward! 💪",
  "You're stronger than you think. Keep going! 🔥",
  "Progress isn't always visible, but it's happening! ✨",
  "Your future self will thank you for today's effort! 🌟",
  "Small steps lead to big changes! Keep moving! 🚀",
  "You've got this! One rep at a time! 💯",
  "Consistency beats perfection. You're doing great! 🎯",
  "Every meal you log is a step toward your goal! 🥗",
  "Your dedication is inspiring! Keep it up! 🌈",
  "Remember why you started. You're on the right track! ⭐",
];

// POST /api/notifications/send
// Send daily motivational notification to a user
router.post('/send', async (req, res) => {
  try {
    const { userId, type } = req.body; // type: 'workout', 'meal', 'general'

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's recent activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayWorkouts = await WorkoutLog.countDocuments({
      userId,
      date: { $gte: today },
    });

    const todayMeals = await MealLog.countDocuments({
      userId,
      date: { $gte: today },
    });

    // Select appropriate message based on activity
    let message = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    
    if (type === 'workout' && todayWorkouts === 0) {
      message = "Time to get moving! Log a workout today! 💪";
    } else if (type === 'meal' && todayMeals === 0) {
      message = "Don't forget to log your meals! Track your nutrition! 🥗";
    } else if (todayWorkouts > 0 && todayMeals > 0) {
      message = "Great job today! You're staying consistent! 🌟";
    }

    res.json({
      success: true,
      message,
      user: {
        name: user.name,
        email: user.email,
      },
      stats: {
        workoutsToday: todayWorkouts,
        mealsToday: todayMeals,
      },
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Send notification error:', err);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

// GET /api/notifications/daily/:userId
// Get daily motivational message for a user
router.get('/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayWorkouts = await WorkoutLog.countDocuments({
      userId,
      date: { $gte: today },
    });

    const todayMeals = await MealLog.countDocuments({
      userId,
      date: { $gte: today },
    });

    const message = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

    res.json({
      success: true,
      message,
      stats: {
        workoutsToday: todayWorkouts,
        mealsToday: todayMeals,
      },
    });
  } catch (err) {
    console.error('Get daily notification error:', err);
    res.status(500).json({ success: false, message: 'Failed to get notification' });
  }
});

export default router;

