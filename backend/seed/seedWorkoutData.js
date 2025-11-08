import mongoose from "mongoose";
import dotenv from "dotenv";
import Workout from "../models/Workout.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurafit';
const DB_NAME = process.env.DB_NAME || 'aurafit';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB for seeding workout data");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// 20 different workout types with body parts
const workouts = [
  // Legs & Lower Body
  { title: "Leg Day Strength", type: "strength", durationMin: 45, difficulty: "hard", bodyParts: ["legs", "lowerbody"], equipment: "barbell", caloriesPerMin: 8, exercises: [{ name: "Squats", sets: 4, reps: 8 }, { name: "Leg Press", sets: 3, reps: 12 }] },
  { title: "Quad Dominant", type: "strength", durationMin: 40, difficulty: "medium", bodyParts: ["legs", "lowerbody"], equipment: "dumbbells", caloriesPerMin: 7, exercises: [{ name: "Front Squats", sets: 3, reps: 10 }, { name: "Lunges", sets: 3, reps: 12 }] },
  { title: "Glute Activation", type: "strength", durationMin: 35, difficulty: "medium", bodyParts: ["legs", "glutes", "lowerbody"], equipment: "resistance-bands", caloriesPerMin: 6, exercises: [{ name: "Hip Thrusts", sets: 4, reps: 12 }, { name: "Romanian Deadlifts", sets: 3, reps: 10 }] },
  { title: "Lower Body HIIT", type: "hiit", durationMin: 30, difficulty: "hard", bodyParts: ["legs", "lowerbody"], equipment: "bodyweight", caloriesPerMin: 10, exercises: [{ name: "Jump Squats", sets: 4, reps: 15 }, { name: "Burpees", sets: 4, reps: 12 }] },
  
  // Arms & Upper Body
  { title: "Arm Day Pump", type: "strength", durationMin: 40, difficulty: "medium", bodyParts: ["arms", "upperbody"], equipment: "dumbbells", caloriesPerMin: 6, exercises: [{ name: "Bicep Curls", sets: 4, reps: 12 }, { name: "Tricep Dips", sets: 3, reps: 10 }] },
  { title: "Upper Body Strength", type: "strength", durationMin: 50, difficulty: "hard", bodyParts: ["arms", "upperbody", "chest", "back"], equipment: "barbell", caloriesPerMin: 7, exercises: [{ name: "Bench Press", sets: 4, reps: 8 }, { name: "Pull-ups", sets: 3, reps: 10 }] },
  { title: "Push Day", type: "strength", durationMin: 45, difficulty: "medium", bodyParts: ["chest", "arms", "upperbody"], equipment: "dumbbells", caloriesPerMin: 7, exercises: [{ name: "Push-ups", sets: 4, reps: 15 }, { name: "Overhead Press", sets: 3, reps: 10 }] },
  { title: "Pull Day", type: "strength", durationMin: 45, difficulty: "medium", bodyParts: ["back", "arms", "upperbody"], equipment: "cable", caloriesPerMin: 7, exercises: [{ name: "Barbell Rows", sets: 4, reps: 10 }, { name: "Lat Pulldowns", sets: 3, reps: 12 }] },
  
  // Chest
  { title: "Chest & Shoulders", type: "strength", durationMin: 40, difficulty: "medium", bodyParts: ["chest", "upperbody"], equipment: "dumbbells", caloriesPerMin: 7, exercises: [{ name: "Dumbbell Press", sets: 4, reps: 10 }, { name: "Flyes", sets: 3, reps: 12 }] },
  { title: "Chest Focus", type: "strength", durationMin: 35, difficulty: "hard", bodyParts: ["chest", "upperbody"], equipment: "barbell", caloriesPerMin: 8, exercises: [{ name: "Bench Press", sets: 5, reps: 5 }, { name: "Incline Press", sets: 3, reps: 8 }] },
  
  // Back
  { title: "Back Builder", type: "strength", durationMin: 45, difficulty: "medium", bodyParts: ["back", "upperbody"], equipment: "cable", caloriesPerMin: 7, exercises: [{ name: "Deadlifts", sets: 4, reps: 8 }, { name: "T-Bar Rows", sets: 3, reps: 10 }] },
  { title: "Wide Back", type: "strength", durationMin: 40, difficulty: "hard", bodyParts: ["back", "upperbody"], equipment: "machine", caloriesPerMin: 7, exercises: [{ name: "Wide Grip Pull-ups", sets: 4, reps: 10 }, { name: "Cable Rows", sets: 3, reps: 12 }] },
  
  // Abs & Core
  { title: "Core Crusher", type: "strength", durationMin: 25, difficulty: "medium", bodyParts: ["abs", "abdomen"], equipment: "bodyweight", caloriesPerMin: 5, exercises: [{ name: "Crunches", sets: 3, reps: 20 }, { name: "Plank", sets: 3, reps: 60 }] },
  { title: "Six Pack Abs", type: "strength", durationMin: 30, difficulty: "hard", bodyParts: ["abs", "abdomen"], equipment: "bodyweight", caloriesPerMin: 6, exercises: [{ name: "Leg Raises", sets: 4, reps: 15 }, { name: "Russian Twists", sets: 3, reps: 20 }] },
  { title: "Core Stability", type: "mobility", durationMin: 20, difficulty: "easy", bodyParts: ["abs", "abdomen"], equipment: "bodyweight", caloriesPerMin: 4, exercises: [{ name: "Plank Variations", sets: 3, reps: 30 }, { name: "Dead Bug", sets: 3, reps: 12 }] },
  
  // Full Body & Cardio
  { title: "Full Body HIIT", type: "hiit", durationMin: 30, difficulty: "hard", bodyParts: ["fullbody", "cardio"], equipment: "bodyweight", caloriesPerMin: 12, exercises: [{ name: "Burpees", sets: 5, reps: 10 }, { name: "Mountain Climbers", sets: 4, reps: 20 }] },
  { title: "Cardio Endurance", type: "cardio", durationMin: 45, difficulty: "medium", bodyParts: ["cardio", "fullbody"], equipment: "none", caloriesPerMin: 10, exercises: [{ name: "Running", sets: 1, reps: 1 }, { name: "Cycling", sets: 1, reps: 1 }] },
  { title: "CrossFit WOD", type: "crossfit", durationMin: 20, difficulty: "hard", bodyParts: ["fullbody"], equipment: "barbell", caloriesPerMin: 15, exercises: [{ name: "Thrusters", sets: 5, reps: 10 }, { name: "Pull-ups", sets: 5, reps: 10 }] },
  { title: "Yoga Flow", type: "yoga", durationMin: 60, difficulty: "easy", bodyParts: ["fullbody", "mobility"], equipment: "none", caloriesPerMin: 3, exercises: [{ name: "Sun Salutation", sets: 1, reps: 1 }, { name: "Warrior Poses", sets: 1, reps: 1 }] },
  { title: "Pilates Core", type: "pilates", durationMin: 40, difficulty: "medium", bodyParts: ["abs", "abdomen", "fullbody"], equipment: "bodyweight", caloriesPerMin: 4, exercises: [{ name: "Hundred", sets: 1, reps: 100 }, { name: "Roll Up", sets: 3, reps: 10 }] },
];

const seedWorkouts = async () => {
  await connectDB();
  try {
    // Clear existing workouts (optional)
    const deleted = await Workout.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing workouts`);

    // Insert new workouts
    const inserted = await Workout.insertMany(workouts);
    console.log(`✅ Successfully seeded ${inserted.length} workouts`);
    console.log(`   - ${workouts.filter(w => w.bodyParts.includes('legs')).length} leg workouts`);
    console.log(`   - ${workouts.filter(w => w.bodyParts.includes('arms')).length} arm workouts`);
    console.log(`   - ${workouts.filter(w => w.bodyParts.includes('chest')).length} chest workouts`);
    console.log(`   - ${workouts.filter(w => w.bodyParts.includes('back')).length} back workouts`);
    console.log(`   - ${workouts.filter(w => w.bodyParts.includes('abs')).length} abs workouts`);
    console.log("🎉 Workout seed data successfully added!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWorkouts();
}

export default seedWorkouts;

