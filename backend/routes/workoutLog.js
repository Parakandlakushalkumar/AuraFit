import { Router } from 'express';
import mongoose from 'mongoose';
import WorkoutLog from '../models/WorkoutLog.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// MET values for different workout types (calories per minute per kg)
const MET_VALUES = {
  'walking': 3.5,
  'running': 9.8,
  'cycling': 7.5,
  'swimming': 8.0,
  'strength': 5.0,
  'hiit': 12.0,
  'yoga': 3.0,
  'pilates': 3.5,
  'cardio': 7.0,
  'crossfit': 10.0,
  'dance': 6.0,
  'boxing': 12.5,
  'default': 6.0,
};

// Calculate calories burned
const calculateCalories = (workoutType, durationMin, userWeight = 70) => {
  const met = MET_VALUES[workoutType.toLowerCase()] || MET_VALUES.default;
  // Calories = MET × weight(kg) × duration(hours)
  return Math.round(met * userWeight * (durationMin / 60));
};

// POST /api/workout/log
router.post('/log', async (req, res) => {
  try {
    const { userId, workoutType, durationMin, notes, intensity, userWeight } = req.body;

    if (!userId || !workoutType || !durationMin) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const caloriesBurned = calculateCalories(workoutType, durationMin, userWeight);

    const log = await WorkoutLog.create({
      userId,
      workoutType,
      durationMin,
      caloriesBurned,
      notes,
      intensity: intensity || 'medium',
      date: new Date(),
    });

    res.status(201).json({ success: true, log });
  } catch (err) {
    console.error('Workout log error:', err);
    res.status(500).json({ success: false, message: 'Failed to log workout' });
  }
});

// GET /api/workout/log/:userId
router.get('/log/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const query = { userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(100);

    const totalCalories = logs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalDuration = logs.reduce((sum, log) => sum + log.durationMin, 0);

    res.json({
      success: true,
      logs,
      summary: {
        totalWorkouts: logs.length,
        totalCaloriesBurned: totalCalories,
        totalDuration,
        averageCaloriesPerWorkout: logs.length > 0 ? Math.round(totalCalories / logs.length) : 0,
      },
    });
  } catch (err) {
    console.error('Get workout logs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch workout logs' });
  }
});

// DELETE /api/workout/log/:id
router.delete('/log/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid log ID' });
    }

    const deleted = await WorkoutLog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }

    res.json({ success: true, message: 'Workout log deleted' });
  } catch (err) {
    console.error('Delete workout log error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete log' });
  }
});

export default router;

