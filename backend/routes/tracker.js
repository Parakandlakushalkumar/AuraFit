import { Router } from 'express';
import mongoose from 'mongoose';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Workout from '../models/Workout.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET — get tracker data for a user with body part breakdown
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'total' } = req.query; // 'weekly', 'monthly', 'total'

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Calculate date range based on period
    let startDate = null;
    if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get completed workout plans
    const query = { userId, status: 'completed' };
    if (startDate) {
      query.date = { $gte: startDate };
    }

    const completedPlans = await WorkoutPlan.find(query)
      .populate('workoutId')
      .sort({ date: -1 });

    // Body parts to track
    const bodyParts = ['legs', 'arms', 'upperbody', 'lowerbody', 'chest', 'back', 'abdomen', 'abs'];
    
    // Initialize stats for each body part
    const bodyPartStats = {};
    bodyParts.forEach(part => {
      bodyPartStats[part] = {
        workouts: 0,
        totalDuration: 0,
        totalCalories: 0,
        lastWorkout: null,
        workoutsList: [],
      };
    });

    // Process each completed workout
    completedPlans.forEach(plan => {
      const workout = plan.workoutId;
      if (!workout) return;

      // Get body parts from workout or plan
      const parts = plan.bodyParts && plan.bodyParts.length > 0 
        ? plan.bodyParts 
        : (workout.bodyParts && workout.bodyParts.length > 0 
            ? workout.bodyParts 
            : []);

      // If no body parts specified, try to infer from workout title/type
      if (parts.length === 0) {
        const title = (workout.title || '').toLowerCase();
        if (title.includes('leg') || title.includes('squat') || title.includes('lunge')) {
          parts.push('legs', 'lowerbody');
        } else if (title.includes('arm') || title.includes('bicep') || title.includes('tricep')) {
          parts.push('arms', 'upperbody');
        } else if (title.includes('chest') || title.includes('push')) {
          parts.push('chest', 'upperbody');
        } else if (title.includes('back') || title.includes('pull') || title.includes('row')) {
          parts.push('back', 'upperbody');
        } else if (title.includes('abs') || title.includes('core') || title.includes('abdominal')) {
          parts.push('abs', 'abdomen');
        } else if (workout.type === 'cardio' || workout.type === 'hiit') {
          parts.push('cardio');
        } else {
          parts.push('fullbody');
        }
      }

      // Update stats for each body part
      parts.forEach(part => {
        if (bodyPartStats[part]) {
          bodyPartStats[part].workouts += 1;
          bodyPartStats[part].totalDuration += (plan.durationMin || workout.durationMin || 30);
          bodyPartStats[part].totalCalories += (plan.caloriesBurned || 0);
          
          if (!bodyPartStats[part].lastWorkout || new Date(plan.date) > new Date(bodyPartStats[part].lastWorkout)) {
            bodyPartStats[part].lastWorkout = plan.date;
          }

          bodyPartStats[part].workoutsList.push({
            date: plan.date,
            workoutTitle: workout.title,
            duration: plan.durationMin || workout.durationMin || 30,
            calories: plan.caloriesBurned || 0,
          });
        }
      });
    });

    // Calculate percentages based on realistic targets (not relative to max)
    // Target: 10 workouts per body part for total, 3 for weekly, 8 for monthly
    const targetWorkouts = period === 'weekly' ? 3 : period === 'monthly' ? 8 : 10;
    const totalWorkoutsInPeriod = completedPlans.length;

    // Format response
    const formattedStats = bodyParts.map(part => {
      const stats = bodyPartStats[part];
      // Calculate percentage based on target (cap at 100%)
      const progressPercentage = Math.min(Math.round((stats.workouts / targetWorkouts) * 100), 100);
      
      return {
        name: part,
        displayName: part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        workouts: stats.workouts,
        totalDuration: stats.totalDuration,
        totalCalories: stats.totalCalories,
        lastWorkout: stats.lastWorkout,
        progressPercentage: progressPercentage,
        targetWorkouts: targetWorkouts,
        workoutsList: stats.workoutsList.slice(0, 10), // Last 10 workouts
      };
    });

    res.json({
      success: true,
      period,
      totalWorkouts: completedPlans.length,
      bodyPartStats: formattedStats,
      summary: {
        totalDuration: completedPlans.reduce((sum, p) => sum + (p.durationMin || 0), 0),
        totalCalories: completedPlans.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0),
        averageDuration: completedPlans.length > 0 
          ? Math.round(completedPlans.reduce((sum, p) => sum + (p.durationMin || 0), 0) / completedPlans.length)
          : 0,
      },
    });
  } catch (err) {
    console.error('Get tracker data error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;

