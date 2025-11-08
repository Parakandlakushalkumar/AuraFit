import { Router } from 'express';
import mongoose from 'mongoose';
import AIWorkoutPlan from '../models/AIWorkoutPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Workout from '../models/Workout.js';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Mock AI workout generation (replace with OpenAI API if key available)
const generateWorkoutPlan = (goal, level, equipment) => {
  const exercisesByGoal = {
    'Muscle Gain': {
      Beginner: {
        Dumbbells: ['Dumbbell Press', 'Dumbbell Rows', 'Dumbbell Curls', 'Dumbbell Squats'],
        'Resistance Bands': ['Band Chest Press', 'Band Rows', 'Band Curls', 'Band Squats'],
        None: ['Push-ups', 'Bodyweight Squats', 'Planks', 'Lunges'],
      },
      Intermediate: {
        Dumbbells: ['Dumbbell Bench Press', 'Bent-Over Rows', 'Hammer Curls', 'Goblet Squats', 'Overhead Press'],
        'Resistance Bands': ['Band Flyes', 'Band Pull-Aparts', 'Band Tricep Extensions', 'Band Deadlifts'],
        None: ['Diamond Push-ups', 'Pistol Squats', 'Pull-ups', 'Dips'],
      },
      Advanced: {
        Dumbbells: ['Dumbbell Deadlifts', 'Arnold Press', 'Bulgarian Split Squats', 'Renegade Rows'],
        'Resistance Bands': ['Band Complexes', 'Band Lateral Raises', 'Band Hip Thrusts'],
        None: ['Muscle-ups', 'Handstand Push-ups', 'One-Arm Push-ups'],
      },
    },
    'Weight Loss': {
      Beginner: {
        Dumbbells: ['Dumbbell Swings', 'Dumbbell Lunges', 'Dumbbell Thrusters'],
        'Resistance Bands': ['Band Squats', 'Band Rows', 'Band Presses'],
        None: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees'],
      },
      Intermediate: {
        Dumbbells: ['Dumbbell Complex', 'Dumbbell Clean & Press', 'Dumbbell Snatches'],
        'Resistance Bands': ['Band Burpees', 'Band Jump Squats'],
        None: ['Burpee Variations', 'Sprint Intervals', 'Jump Squats'],
      },
      Advanced: {
        Dumbbells: ['Dumbbell HIIT Circuit', 'Dumbbell AMRAP'],
        'Resistance Bands': ['Band HIIT'],
        None: ['Advanced HIIT', 'Tabata Intervals'],
      },
    },
    'General Fitness': {
      Beginner: {
        Dumbbells: ['Full Body Dumbbell Routine'],
        'Resistance Bands': ['Full Body Band Routine'],
        None: ['Full Body Bodyweight'],
      },
      Intermediate: {
        Dumbbells: ['Upper/Lower Split'],
        'Resistance Bands': ['Push/Pull Split'],
        None: ['Calisthenics Routine'],
      },
      Advanced: {
        Dumbbells: ['Advanced Split'],
        'Resistance Bands': ['Advanced Band Training'],
        None: ['Advanced Calisthenics'],
      },
    },
  };

  const exercises = exercisesByGoal[goal]?.[level]?.[equipment] || ['Push-ups', 'Squats', 'Planks'];
  const durationMap = { Beginner: 30, Intermediate: 45, Advanced: 60 };
  const intensityMap = { Beginner: 'low', Intermediate: 'medium', Advanced: 'high' };

  return {
    title: `${goal} - ${level} ${equipment} Plan`,
    durationMin: durationMap[level] || 30,
    exercises,
    intensity: intensityMap[level] || 'medium',
    description: `Personalized ${goal} workout for ${level} level using ${equipment}.`,
  };
};

// POST /api/ai/workout/generate
router.post('/workout/generate', async (req, res) => {
  try {
    const { userId, goal, level, equipment } = req.body;

    if (!userId || !goal || !level || !equipment) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Generate 10 workout plans based on user details
    const plans = [];
    const variations = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let i = 0; i < 10; i++) {
      const basePlan = generateWorkoutPlan(goal, level, equipment);
      plans.push({
        ...basePlan,
        title: `${basePlan.title} - Variation ${variations[i]}`,
        id: `plan-${i + 1}`,
        week: Math.floor(i / 2) + 1, // Distribute across weeks
      });
    }

    // Store in AIWorkoutPlan
    const savedPlan = await AIWorkoutPlan.create({
      userId,
      goal,
      level,
      equipment,
      plan: plans[0], // Store first plan as primary
    });

    res.json({
      success: true,
      plans,
      savedPlanId: savedPlan._id,
    });
  } catch (err) {
    console.error('AI workout generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate workout plan' });
  }
});

export default router;

