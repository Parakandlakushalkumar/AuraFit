import express from 'express';
import NutritionItem from '../models/NutritionItem.js';
import NutritionPlan from '../models/NutritionPlan.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await NutritionItem.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = await NutritionItem.create(req.body);
  res.status(201).json(item);
});

// GET /api/nutrition/goal/:goal
// Fetches meals matching a user's nutrition goal: "muscle-gain", "fat-loss", or "wellness"
router.get('/goal/:goal', async (req, res) => {
  try {
    const { goal } = req.params;
    
    // First try to get structured nutrition plan
    const goalMap = {
      'muscle-gain': 'Muscle Gain',
      'fat-loss': 'Fat Loss',
      'wellness': 'Wellness',
    };
    
    const planGoal = goalMap[goal.toLowerCase()] || 'Wellness';
    const nutritionPlan = await NutritionPlan.findOne({ goal: planGoal });
    
    if (nutritionPlan) {
      return res.json({
        success: true,
        goal: nutritionPlan.goal,
        description: nutritionPlan.description,
        macros: nutritionPlan.macros,
        meals: nutritionPlan.meals,
        tips: nutritionPlan.tips,
        items: [], // Keep for backward compatibility
      });
    }

    // Fallback to old NutritionItem query
    let query = {};
    switch ((goal || '').toLowerCase()) {
      case 'muscle-gain':
        query = { protein: { $gte: 25 }, calories: { $gte: 400 } };
        break;

      case 'fat-loss':
        query = { calories: { $lte: 400 }, protein: { $gte: 15 } };
        break;

      case 'wellness':
        query = { calories: { $gte: 300, $lte: 550 }, fat: { $lte: 20 } };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid goal type. Use: muscle-gain, fat-loss, or wellness.',
        });
    }

    // Execute MongoDB query using NutritionItem model
    const items = await NutritionItem.find(query).limit(10);

    // Send response
    res.json({
      success: true,
      goal,
      count: items.length,
      items,
    });
  } catch (err) {
    console.error('Error fetching nutrition items:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET /api/nutrition/recommend/:userId
// Fetches meals dynamically based on user's saved fitnessGoal
router.get('/recommend/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const goal = (user.fitnessGoal || '').toLowerCase().replace(' ', '-');
    return res.redirect(302, `/api/nutrition/goal/${goal}`);
  } catch (err) {
    console.error('Error recommending nutrition items:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// POST /api/nutrition/recommend
// AI meal plan recommendation with calorie distribution
router.post('/recommend', async (req, res) => {
  try {
    const { userId, goal, calories } = req.body;

    if (!userId || !goal || !calories) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Macro distribution based on goal
    const macroDistribution = {
      'Muscle Gain': { protein: 0.30, carbs: 0.45, fat: 0.25 },
      'Fat Loss': { protein: 0.35, carbs: 0.35, fat: 0.30 },
      'Weight Loss': { protein: 0.35, carbs: 0.35, fat: 0.30 },
      'General Fitness': { protein: 0.30, carbs: 0.40, fat: 0.30 },
      'Wellness': { protein: 0.25, carbs: 0.45, fat: 0.30 },
    };

    const macros = macroDistribution[goal] || macroDistribution['General Fitness'];
    const proteinCal = Math.round(calories * macros.protein);
    const carbsCal = Math.round(calories * macros.carbs);
    const fatCal = Math.round(calories * macros.fat);

    // Meal suggestions based on goal
    const mealSuggestions = {
      'Muscle Gain': {
        breakfast: ['Protein Oatmeal', 'Greek Yogurt with Berries', 'Protein Smoothie'],
        lunch: ['Grilled Chicken & Rice', 'Salmon with Sweet Potato', 'Lean Beef & Quinoa'],
        dinner: ['Turkey & Vegetables', 'Tuna Salad', 'Chicken Stir-fry'],
        snacks: ['Protein Bar', 'Cottage Cheese', 'Nuts'],
      },
      'Fat Loss': {
        breakfast: ['Green Smoothie', 'Egg Whites & Vegetables', 'Oatmeal with Berries'],
        lunch: ['Grilled Chicken Salad', 'Vegetable Soup', 'Lean Protein & Greens'],
        dinner: ['Baked Fish & Vegetables', 'Turkey & Salad', 'Vegetable Stir-fry'],
        snacks: ['Apple', 'Carrot Sticks', 'Greek Yogurt'],
      },
      'Weight Loss': {
        breakfast: ['Green Smoothie', 'Egg Whites', 'Oatmeal'],
        lunch: ['Chicken Salad', 'Vegetable Soup', 'Lean Protein'],
        dinner: ['Baked Fish', 'Turkey', 'Vegetables'],
        snacks: ['Fruit', 'Vegetables', 'Yogurt'],
      },
      'General Fitness': {
        breakfast: ['Balanced Breakfast', 'Whole Grain Toast', 'Fruit Bowl'],
        lunch: ['Balanced Meal', 'Salad Bowl', 'Protein & Carbs'],
        dinner: ['Balanced Dinner', 'Protein & Vegetables', 'Healthy Plate'],
        snacks: ['Mixed Nuts', 'Fruit', 'Yogurt'],
      },
      'Wellness': {
        breakfast: ['Smoothie Bowl', 'Avocado Toast', 'Fresh Fruit'],
        lunch: ['Quinoa Salad', 'Vegetable Bowl', 'Healthy Wrap'],
        dinner: ['Vegetable Curry', 'Grilled Vegetables', 'Plant-based Meal'],
        snacks: ['Fresh Fruit', 'Vegetables', 'Trail Mix'],
      },
    };

    const meals = mealSuggestions[goal] || mealSuggestions['General Fitness'];

    // Generate 7-day meal plan
    const mealPlan = {};
    for (let day = 1; day <= 7; day++) {
      mealPlan[`day${day}`] = [
        meals.breakfast[Math.floor(Math.random() * meals.breakfast.length)],
        meals.lunch[Math.floor(Math.random() * meals.lunch.length)],
        meals.dinner[Math.floor(Math.random() * meals.dinner.length)],
        meals.snacks[Math.floor(Math.random() * meals.snacks.length)],
      ];
    }

    res.json({
      success: true,
      goal,
      calories,
      macros: {
        protein: { calories: proteinCal, grams: Math.round(proteinCal / 4) },
        carbs: { calories: carbsCal, grams: Math.round(carbsCal / 4) },
        fat: { calories: fatCal, grams: Math.round(fatCal / 9) },
      },
      mealPlan,
    });
  } catch (err) {
    console.error('Nutrition recommendation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate meal plan' });
  }
});

// Merge AI meal plan router (it's already imported in index.js separately)
// This file handles goal-based nutrition, aiMealPlan.js handles AI meal generation

console.log('✅ Smart Nutrition Goal API ready at /api/nutrition/goal/:goal');

export default router;
