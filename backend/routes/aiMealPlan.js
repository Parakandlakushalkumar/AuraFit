import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Mock AI meal planner (replace with OpenAI when API key is available)
const generateAIMealPlan = async (goalType, calories, dietPreference) => {
  // If OpenAI is configured, use it
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Create a ${goalType} diet plan within ${calories} calories per day for someone who prefers: ${dietPreference}. 
      Include 3-5 meals (Breakfast, Lunch, Dinner, and optional Snacks) with specific food items, calories, protein (g), carbs (g), and fat (g) for each meal.
      Return ONLY a valid JSON array in this exact format:
      [
        { "meal": "Breakfast", "items": ["Item 1", "Item 2"], "calories": 500, "protein": 30, "carbs": 50, "fat": 15 },
        { "meal": "Lunch", "items": ["Item 1", "Item 2"], "calories": 700, "protein": 40, "carbs": 60, "fat": 20 }
      ]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error('OpenAI API error:', err.message);
      // Fall through to mock data
    }
  }

  // Fallback to intelligent mock data based on goal
  const mealPlans = {
    'Muscle Gain': [
      { meal: 'Breakfast', items: ['Oatmeal with Banana', 'Whey Protein Shake', 'Almonds'], calories: 550, protein: 45, carbs: 65, fat: 18 },
      { meal: 'Lunch', items: ['Grilled Chicken Breast', 'Brown Rice', 'Steamed Vegetables'], calories: 650, protein: 55, carbs: 70, fat: 12 },
      { meal: 'Dinner', items: ['Salmon Fillet', 'Sweet Potato', 'Broccoli'], calories: 600, protein: 50, carbs: 55, fat: 20 },
      { meal: 'Snack', items: ['Greek Yogurt', 'Berries', 'Peanut Butter'], calories: 400, protein: 30, carbs: 40, fat: 15 },
    ],
    'Fat Loss': [
      { meal: 'Breakfast', items: ['Egg Whites', 'Spinach', 'Whole Grain Toast'], calories: 300, protein: 25, carbs: 30, fat: 8 },
      { meal: 'Lunch', items: ['Grilled Chicken Salad', 'Olive Oil Dressing'], calories: 400, protein: 35, carbs: 20, fat: 15 },
      { meal: 'Dinner', items: ['Baked Fish', 'Quinoa', 'Steamed Vegetables'], calories: 450, protein: 40, carbs: 40, fat: 12 },
      { meal: 'Snack', items: ['Apple', 'Almonds'], calories: 200, protein: 5, carbs: 25, fat: 10 },
    ],
    'Weight Loss': [
      { meal: 'Breakfast', items: ['Green Smoothie', 'Protein Powder'], calories: 280, protein: 30, carbs: 25, fat: 5 },
      { meal: 'Lunch', items: ['Turkey Wrap', 'Mixed Greens'], calories: 350, protein: 30, carbs: 30, fat: 10 },
      { meal: 'Dinner', items: ['Lean Beef', 'Vegetable Stir-fry'], calories: 420, protein: 35, carbs: 25, fat: 15 },
      { meal: 'Snack', items: ['Cottage Cheese', 'Cucumber'], calories: 150, protein: 20, carbs: 8, fat: 3 },
    ],
    'Maintenance': [
      { meal: 'Breakfast', items: ['Scrambled Eggs', 'Avocado Toast', 'Fruit'], calories: 450, protein: 20, carbs: 45, fat: 20 },
      { meal: 'Lunch', items: ['Chicken Sandwich', 'Side Salad'], calories: 550, protein: 35, carbs: 50, fat: 18 },
      { meal: 'Dinner', items: ['Pasta with Meat Sauce', 'Garlic Bread'], calories: 600, protein: 30, carbs: 70, fat: 15 },
      { meal: 'Snack', items: ['Trail Mix', 'Yogurt'], calories: 300, protein: 12, carbs: 35, fat: 12 },
    ],
  };

  const plan = mealPlans[goalType] || mealPlans['Maintenance'];
  
  // Adjust calories to match target
  const totalCalories = plan.reduce((sum, meal) => sum + meal.calories, 0);
  const ratio = calories / totalCalories;
  
  return plan.map(meal => ({
    ...meal,
    calories: Math.round(meal.calories * ratio),
    protein: Math.round(meal.protein * ratio),
    carbs: Math.round(meal.carbs * ratio),
    fat: Math.round(meal.fat * ratio),
  }));
};

// POST /api/nutrition/ai-meal-plan
router.post('/ai-meal-plan', async (req, res) => {
  try {
    const { userId, goalType, calories, dietPreference } = req.body;

    if (!userId || !goalType || !calories) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Get user for additional context
    const user = await User.findById(userId);
    const userGoal = goalType || user?.goalType || 'Maintenance';
    const targetCalories = calories || user?.dailyCalorieTarget || 2000;
    const preference = dietPreference || 'Balanced diet';

    const meals = await generateAIMealPlan(userGoal, targetCalories, preference);

    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

    res.json({
      success: true,
      goalType: userGoal,
      targetCalories,
      dietPreference: preference,
      meals,
      macros: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      },
    });
  } catch (err) {
    console.error('AI meal plan error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate meal plan' });
  }
});

export default router;

