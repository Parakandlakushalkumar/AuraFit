import { Router } from 'express';
import mongoose from 'mongoose';
import MealLog from '../models/MealLog.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/meal/log
router.post('/log', async (req, res) => {
  try {
    const { userId, foodName, calories, protein, carbs, fat, mealType, notes } = req.body;

    if (!userId || !foodName || !calories || !mealType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const log = await MealLog.create({
      userId,
      foodName,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      mealType,
      notes,
      date: new Date(),
    });

    res.status(201).json({ success: true, log });
  } catch (err) {
    console.error('Meal log error:', err);
    res.status(500).json({ success: false, message: 'Failed to log meal' });
  }
});

// GET /api/meal/log/:userId
router.get('/log/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, mealType } = req.query;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const query = { userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (mealType) {
      query.mealType = mealType;
    }

    const logs = await MealLog.find(query)
      .sort({ date: -1 })
      .limit(200);

    // Calculate daily totals
    const dailyTotals = {};
    logs.forEach(log => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 };
      }
      dailyTotals[dateKey].calories += log.calories;
      dailyTotals[dateKey].protein += log.protein;
      dailyTotals[dateKey].carbs += log.carbs;
      dailyTotals[dateKey].fat += log.fat;
      dailyTotals[dateKey].meals += 1;
    });

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFat = logs.reduce((sum, log) => sum + log.fat, 0);

    res.json({
      success: true,
      logs,
      summary: {
        totalMeals: logs.length,
        totalCalories,
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        averageCaloriesPerMeal: logs.length > 0 ? Math.round(totalCalories / logs.length) : 0,
        avgProteinIntake: logs.length > 0 ? Math.round(totalProtein / logs.length) : 0,
      },
      dailyTotals,
    });
  } catch (err) {
    console.error('Get meal logs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch meal logs' });
  }
});

// DELETE /api/meal/log/:id
router.delete('/log/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid log ID' });
    }

    const deleted = await MealLog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }

    res.json({ success: true, message: 'Meal log deleted' });
  } catch (err) {
    console.error('Delete meal log error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete log' });
  }
});

export default router;

