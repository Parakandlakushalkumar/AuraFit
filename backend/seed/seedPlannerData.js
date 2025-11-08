import mongoose from "mongoose";
import dotenv from "dotenv";
import WorkoutPlan from "../models/WorkoutPlan.js";
import Workout from "../models/Workout.js";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurafit';
const DB_NAME = process.env.DB_NAME || 'aurafit';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB for seeding planner data");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Generate 100 diverse planner entries
const generatePlannerData = async () => {
  try {
    // Get all users and workouts from database
    const users = await User.find();
    const workouts = await Workout.find();

    if (users.length === 0 || workouts.length === 0) {
      console.log("⚠️ No users or workouts found. Please seed users and workouts first.");
      return;
    }

    const goals = ['Muscle Gain', 'Weight Loss', 'General Fitness', 'Endurance Training', 'Weight Gain'];
    const statuses = ['planned', 'completed', 'missed'];
    
    // Generate plans based on user attributes
    const plans = [];
    const today = new Date();
    
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const workout = workouts[Math.floor(Math.random() * workouts.length)];
      const goal = user.fitnessGoal || goals[Math.floor(Math.random() * goals.length)];
      
      // Generate date within next 60 days (some past, some future)
      const daysOffset = Math.floor(Math.random() * 60) - 15; // -15 to +45 days
      const planDate = new Date(today);
      planDate.setDate(planDate.getDate() + daysOffset);
      
      // Determine status based on date
      let status = 'planned';
      if (planDate < today) {
        status = Math.random() > 0.3 ? 'completed' : 'missed';
      }
      
      // Calculate duration and calories based on user attributes and goal
      let durationMin = 30;
      let caloriesBurned = null;
      
      if (user.height && user.weight) {
        const bmi = user.weight / Math.pow(user.height / 100, 2);
        
        // Adjust duration based on goal
        if (goal === 'Muscle Gain' || goal === 'Weight Gain') {
          durationMin = 45 + Math.floor(Math.random() * 30); // 45-75 min
        } else if (goal === 'Weight Loss') {
          durationMin = 30 + Math.floor(Math.random() * 30); // 30-60 min
        } else if (goal === 'Endurance Training') {
          durationMin = 40 + Math.floor(Math.random() * 40); // 40-80 min
        } else {
          durationMin = 30 + Math.floor(Math.random() * 30); // 30-60 min
        }
        
        // Estimate calories burned (rough calculation)
        if (status === 'completed') {
          const baseCalories = (user.weight * 0.5) * (durationMin / 60);
          caloriesBurned = Math.round(baseCalories * (0.8 + Math.random() * 0.4)); // ±20% variance
        }
      }
      
      // Generate notes based on goal
      const notesByGoal = {
        'Muscle Gain': [
          'Focus on progressive overload',
          'Heavy compound movements',
          'Protein intake post-workout',
          'Rest between sets: 2-3 min',
          'Focus on form and control'
        ],
        'Weight Loss': [
          'High intensity intervals',
          'Cardio focus',
          'Stay hydrated',
          'Monitor heart rate',
          'Cool down properly'
        ],
        'General Fitness': [
          'Full body workout',
          'Balance strength and cardio',
          'Listen to your body',
          'Proper warm-up',
          'Stretch after workout'
        ],
        'Endurance Training': [
          'Long duration, moderate intensity',
          'Maintain steady pace',
          'Focus on breathing',
          'Build aerobic capacity',
          'Recovery is key'
        ],
        'Weight Gain': [
          'Compound movements',
          'Adequate rest periods',
          'Post-workout nutrition',
          'Progressive overload',
          'Full body engagement'
        ]
      };
      
      const notes = notesByGoal[goal] 
        ? notesByGoal[goal][Math.floor(Math.random() * notesByGoal[goal].length)]
        : 'Stay consistent and track progress';
      
      plans.push({
        userId: user._id,
        workoutId: workout._id,
        date: planDate,
        status,
        notes,
        durationMin,
        caloriesBurned,
      });
    }
    
    // Insert all plans
    await WorkoutPlan.insertMany(plans);
    console.log(`✅ Successfully seeded ${plans.length} planner entries`);
    console.log(`   - Plans distributed across ${users.length} users`);
    console.log(`   - Plans based on ${workouts.length} different workouts`);
    console.log(`   - Status breakdown: ${plans.filter(p => p.status === 'planned').length} planned, ${plans.filter(p => p.status === 'completed').length} completed, ${plans.filter(p => p.status === 'missed').length} missed`);
    
  } catch (err) {
    console.error("❌ Error generating planner data:", err.message);
    throw err;
  }
};

const seedPlannerData = async () => {
  await connectDB();
  try {
    // Clear existing plans (optional - comment out if you want to keep existing)
    const deleted = await WorkoutPlan.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing plans`);
    
    await generatePlannerData();
    console.log("🎉 Planner seed data successfully added!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPlannerData();
}

export default seedPlannerData;

