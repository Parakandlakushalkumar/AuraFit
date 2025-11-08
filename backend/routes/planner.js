import { Router } from 'express';
import mongoose from 'mongoose';
import WorkoutPlan from '../models/WorkoutPlan.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST — create a workout plan
router.post('/', async (req, res) => {
  try {
    const { userId, workoutId, date, notes, durationMin } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(workoutId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId or workoutId' });
    }
    if (!date) return res.status(400).json({ success: false, message: 'date is required' });

    const scheduledDate = new Date(date);
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    await WorkoutPlan.create({
      userId,
      workoutId,
      date: scheduledDate,
      notes: notes || '',
      durationMin: durationMin || undefined,
    });

    res.json({ success: true, message: 'Workout scheduled successfully' });
  } catch {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET — list plans for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId))
      return res.status(400).json({ success: false, message: 'Invalid userId' });

    const plans = await WorkoutPlan.find({ userId })
      .sort({ date: 1 })
      .populate('workoutId', 'title');

    const shaped = plans.map((p) => ({
      _id: p._id,
      date: p.date,
      workoutId: p.workoutId ? { title: p.workoutId.title } : null,
      status: p.status,
      notes: p.notes,
      caloriesBurned: p.caloriesBurned,
      durationMin: p.durationMin,
    }));

    res.json(shaped);
  } catch {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PATCH — mark workout as complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'completed', caloriesBurned, durationMin } = req.body;

    if (!isValidObjectId(id))
      return res.status(400).json({ success: false, message: 'Invalid plan id' });
    if (!['planned', 'completed', 'missed'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const update = { status };
    if (typeof caloriesBurned === 'number') update.caloriesBurned = caloriesBurned;
    if (typeof durationMin === 'number') update.durationMin = durationMin;

    const doc = await WorkoutPlan.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Plan not found' });

    res.json({ success: true, message: 'Workout marked as completed' });
  } catch {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE — delete plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ success: false, message: 'Invalid plan id' });

    const del = await WorkoutPlan.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ success: false, message: 'Plan not found' });

    res.json({ success: true, message: 'Workout plan deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET — suggest plans based on user attributes
router.get('/suggest/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'weekly' } = req.query; // 'weekly' or 'monthly'
    
    if (!isValidObjectId(userId))
      return res.status(400).json({ success: false, message: 'Invalid userId' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Get workouts matching user's fitness goal
    const goal = user.fitnessGoal || 'General Fitness';
    const goalKeywords = {
      'Muscle Gain': ['strength', 'muscle', 'power', 'build'],
      'Weight Loss': ['cardio', 'hiit', 'fat', 'burn'],
      'Weight Gain': ['strength', 'muscle', 'bulk'],
      'Endurance Training': ['endurance', 'cardio', 'running', 'cycling'],
      'General Fitness': ['full', 'body', 'fitness', 'general'],
    };

    const keywords = goalKeywords[goal] || goalKeywords['General Fitness'];
    const workoutQuery = {
      $or: keywords.map(kw => ({
        $or: [
          { type: { $regex: kw, $options: 'i' } },
          { title: { $regex: kw, $options: 'i' } },
          { description: { $regex: kw, $options: 'i' } },
        ],
      })),
    };

    const suggestedWorkouts = await Workout.find(workoutQuery).limit(20);

    if (suggestedWorkouts.length === 0) {
      // Fallback to all workouts if no matches
      const allWorkouts = await Workout.find().limit(20);
      suggestedWorkouts.push(...allWorkouts);
    }

    // Calculate days for period
    const days = period === 'monthly' ? 30 : 7;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Generate suggested plans
    const suggestedPlans = [];
    const workoutsPerWeek = period === 'monthly' ? 12 : 3; // 3 per week for weekly, 12 for monthly

    for (let i = 0; i < workoutsPerWeek; i++) {
      const workout = suggestedWorkouts[Math.floor(Math.random() * suggestedWorkouts.length)];
      const dayOffset = Math.floor((i / workoutsPerWeek) * days);
      const planDate = new Date(startDate);
      planDate.setDate(planDate.getDate() + dayOffset);

      // Calculate duration based on user attributes
      let durationMin = 30;
      if (user.height && user.weight) {
        if (goal === 'Muscle Gain' || goal === 'Weight Gain') {
          durationMin = 45 + Math.floor(Math.random() * 30);
        } else if (goal === 'Weight Loss') {
          durationMin = 30 + Math.floor(Math.random() * 30);
        } else if (goal === 'Endurance Training') {
          durationMin = 40 + Math.floor(Math.random() * 40);
        }
      }

      suggestedPlans.push({
        workoutId: workout._id,
        workout: {
          _id: workout._id,
          title: workout.title,
          type: workout.type,
          durationMin: workout.durationMin || durationMin,
        },
        date: planDate,
        suggestedDuration: durationMin,
        goal,
        notes: `Recommended for ${goal} goal`,
      });
    }

    res.json({
      success: true,
      period,
      goal,
      userAttributes: {
        height: user.height,
        weight: user.weight,
        age: user.age,
      },
      suggestedPlans: suggestedPlans.sort((a, b) => a.date - b.date),
    });
  } catch (err) {
    console.error('Suggest plans error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
