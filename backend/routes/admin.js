import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import WorkoutLog from '../models/WorkoutLog.js';
import MealLog from '../models/MealLog.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('name email age gender height weight goalType dailyCalorieTarget xp role createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    // Get stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const workoutLogs = await WorkoutLog.find({ userId: user._id });
        const mealLogs = await MealLog.find({ userId: user._id });
        const plans = await WorkoutPlan.find({ userId: user._id, status: 'completed' });

        return {
          ...user.toObject(),
          stats: {
            totalWorkouts: workoutLogs.length,
            totalMeals: mealLogs.length,
            completedPlans: plans.length,
            totalCaloriesBurned: workoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
            totalCaloriesConsumed: mealLogs.reduce((sum, log) => sum + log.calories, 0),
            xp: user.xp || 0,
          },
        };
      })
    );

    res.json({ success: true, users: usersWithStats, total: usersWithStats.length });
  } catch (err) {
    console.error('Get admin users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET /api/admin/user/:id/logs
router.get('/user/:id/logs', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const workoutLogs = await WorkoutLog.find({ userId: id }).sort({ date: -1 }).limit(50);
    const mealLogs = await MealLog.find({ userId: id }).sort({ date: -1 }).limit(50);
    const plans = await WorkoutPlan.find({ userId: id }).sort({ date: -1 }).limit(50);

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        goalType: user.goalType,
        dailyCalorieTarget: user.dailyCalorieTarget,
      },
      workoutLogs,
      mealLogs,
      plans,
    });
  } catch (err) {
    console.error('Get user logs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user logs' });
  }
});

// POST /api/admin/user/:id/suggestion
router.post('/user/:id/suggestion', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { suggestion, type } = req.body; // type: 'workout', 'nutrition', 'general'

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In production, store suggestions in a separate Suggestions model
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Suggestion sent to user',
      suggestion: {
        userId: id,
        type: type || 'general',
        message: suggestion,
        from: req.user.name || 'Admin',
        createdAt: new Date(),
      },
    });
  } catch (err) {
    console.error('Send suggestion error:', err);
    res.status(500).json({ success: false, message: 'Failed to send suggestion' });
  }
});

export default router;

