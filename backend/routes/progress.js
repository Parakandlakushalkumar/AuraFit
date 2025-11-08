import { Router } from 'express';
import mongoose from 'mongoose';
import WorkoutPlan from '../models/WorkoutPlan.js';
import WorkoutLog from '../models/WorkoutLog.js';
import MealLog from '../models/MealLog.js';
import PoseLog from '../models/PoseLog.js';
import User from '../models/User.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/progress/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get completed workouts
    const completedWorkouts = await WorkoutPlan.find({
      userId,
      status: 'completed',
    });

    const workoutsCompleted = completedWorkouts.length;
    const totalCaloriesBurned = completedWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const avgCaloriesBurned = workoutsCompleted > 0 ? Math.round(totalCaloriesBurned / workoutsCompleted) : 0;

    // Get pose logs
    const poseLogs = await PoseLog.find({ userId });
    const avgPoseAccuracy = poseLogs.length > 0
      ? Math.round(poseLogs.reduce((sum, log) => sum + log.accuracy, 0) / poseLogs.length)
      : 0;

    // Get last 7 days data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWorkouts = await WorkoutPlan.find({
      userId,
      status: 'completed',
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Group by date
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayWorkouts = recentWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === date.getTime();
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      });
    }

    res.json({
      success: true,
      workoutsCompleted,
      avgCaloriesBurned,
      avgPoseAccuracy,
      xp: user.xp || 0,
      last7Days,
      totalWorkouts: completedWorkouts.length,
      totalCaloriesBurned,
    });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch progress' });
  }
});

// GET /api/progress/:userId/detailed
router.get('/:userId/detailed', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get date ranges
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Get workout logs
    const allWorkoutLogs = await WorkoutLog.find({ userId });
    const weeklyWorkoutLogs = await WorkoutLog.find({ userId, date: { $gte: weekAgo } });
    const monthlyWorkoutLogs = await WorkoutLog.find({ userId, date: { $gte: monthAgo } });

    // Get meal logs
    const allMealLogs = await MealLog.find({ userId });
    const weeklyMealLogs = await MealLog.find({ userId, date: { $gte: weekAgo } });
    const monthlyMealLogs = await MealLog.find({ userId, date: { $gte: monthAgo } });

    // Calculate totals
    const totalCaloriesBurned = allWorkoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalCaloriesConsumed = allMealLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = allMealLogs.reduce((sum, log) => sum + log.protein, 0);
    const avgProteinIntake = allMealLogs.length > 0 ? Math.round(totalProtein / allMealLogs.length) : 0;

    // Calculate streak (consecutive days with at least one workout or meal logged)
    const workoutDates = [...new Set(allWorkoutLogs.map(log => log.date.toISOString().split('T')[0]))];
    const mealDates = [...new Set(allMealLogs.map(log => log.date.toISOString().split('T')[0]))];
    const allActivityDates = [...new Set([...workoutDates, ...mealDates])].sort().reverse();
    
    let streakDays = 0;
    const todayStr = today.toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (allActivityDates.includes(dateStr)) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Generate weekly graph data
    const weeklyGraph = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayWorkouts = weeklyWorkoutLogs.filter(log => log.date.toISOString().split('T')[0] === dateStr);
      const dayMeals = weeklyMealLogs.filter(log => log.date.toISOString().split('T')[0] === dateStr);

      const caloriesOut = dayWorkouts.reduce((sum, log) => sum + log.caloriesBurned, 0);
      const caloriesIn = dayMeals.reduce((sum, log) => sum + log.calories, 0);

      weeklyGraph.push({
        date: dateStr,
        caloriesIn,
        caloriesOut,
        netCalories: caloriesIn - caloriesOut,
      });
    }

    res.json({
      success: true,
      totalWorkouts: allWorkoutLogs.length,
      totalCaloriesBurned,
      totalCaloriesConsumed,
      avgProteinIntake,
      streakDays,
      weeklyGraph,
      weeklyStats: {
        workouts: weeklyWorkoutLogs.length,
        caloriesBurned: weeklyWorkoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
        caloriesConsumed: weeklyMealLogs.reduce((sum, log) => sum + log.calories, 0),
      },
      monthlyStats: {
        workouts: monthlyWorkoutLogs.length,
        caloriesBurned: monthlyWorkoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
        caloriesConsumed: monthlyMealLogs.reduce((sum, log) => sum + log.calories, 0),
      },
    });
  } catch (err) {
    console.error('Get detailed progress error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch detailed progress' });
  }
});

export default router;

