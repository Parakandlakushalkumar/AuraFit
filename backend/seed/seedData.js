import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// --- Connect to MongoDB ---
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "aurafit";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// --- Schemas ---
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
});

const workoutSchema = new mongoose.Schema({
  title: String,
  type: String,
  durationMin: Number,
  difficulty: String,
  exercises: [String],
});

const nutritionSchema = new mongoose.Schema({
  name: String,
  macros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  tags: [String],
});

const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  likes: Number,
});

// --- Models ---
const User = mongoose.model("User", userSchema);
const Workout = mongoose.model("Workout", workoutSchema);
const NutritionItem = mongoose.model("NutritionItem", nutritionSchema);
const Post = mongoose.model("Post", postSchema);

// --- Sample Data ---
const users = [
  { name: "Kushal", email: "kushal@example.com", passwordHash: "hashed123", height: 175, weight: 70, fitnessGoal: "Muscle Gain" },
  { name: "Arjun", email: "arjun@example.com", passwordHash: "hashed123", height: 168, weight: 62, fitnessGoal: "Weight Loss" },
  { name: "Maya", email: "maya@example.com", passwordHash: "hashed123", height: 160, weight: 55, fitnessGoal: "Endurance Training" },
  { name: "Sana", email: "sana@example.com", passwordHash: "hashed123", height: 165, weight: 58, fitnessGoal: "General Fitness" },
  { name: "Ravi", email: "ravi@example.com", passwordHash: "hashed123", height: 178, weight: 82, fitnessGoal: "Muscle Gain" },
  { name: "Priya", email: "priya@example.com", passwordHash: "hashed123", height: 158, weight: 54, fitnessGoal: "Weight Loss" },
  { name: "Nikhil", email: "nikhil@example.com", passwordHash: "hashed123", height: 170, weight: 73, fitnessGoal: "Endurance Training" },
  { name: "Aarav", email: "aarav@example.com", passwordHash: "hashed123", height: 180, weight: 85, fitnessGoal: "Strength Training" },
  { name: "Riya", email: "riya@example.com", passwordHash: "hashed123", height: 162, weight: 60, fitnessGoal: "Flexibility" },
  { name: "Divya", email: "divya@example.com", passwordHash: "hashed123", height: 167, weight: 65, fitnessGoal: "General Fitness" },
  { name: "Karan", email: "karan@example.com", passwordHash: "hashed123", height: 172, weight: 75, fitnessGoal: "Muscle Gain" },
  { name: "Neha", email: "neha@example.com", passwordHash: "hashed123", height: 163, weight: 57, fitnessGoal: "Weight Maintenance" },
];

const workouts = [
  { title: "Leg Day Strength", type: "strength", durationMin: 45, difficulty: "hard", exercises: ["Squats", "Lunges", "Deadlifts", "Leg Press"] },
  { title: "HIIT Cardio Burn", type: "hiit", durationMin: 30, difficulty: "medium", exercises: ["Burpees", "Jump Squats", "Mountain Climbers"] },
  { title: "Core Crusher", type: "mobility", durationMin: 25, difficulty: "easy", exercises: ["Crunches", "Plank", "Russian Twists"] },
  { title: "Push Pull Day", type: "strength", durationMin: 50, difficulty: "hard", exercises: ["Pullups", "Pushups", "Bench Press"] },
  { title: "Morning Yoga Flow", type: "mobility", durationMin: 40, difficulty: "easy", exercises: ["Sun Salutation", "Downward Dog", "Child Pose"] },
  { title: "Cardio Endurance", type: "hiit", durationMin: 35, difficulty: "medium", exercises: ["Running", "Cycling", "Skipping"] },
  { title: "Upper Body Pump", type: "strength", durationMin: 45, difficulty: "medium", exercises: ["Bicep Curls", "Tricep Dips", "Overhead Press"] },
  { title: "Glute Activation", type: "mobility", durationMin: 30, difficulty: "easy", exercises: ["Glute Bridges", "Kickbacks", "Clamshells"] },
  { title: "Full Body HIIT", type: "hiit", durationMin: 30, difficulty: "hard", exercises: ["Burpees", "Jump Lunges", "Mountain Climbers"] },
  { title: "Core Balance Routine", type: "mobility", durationMin: 20, difficulty: "easy", exercises: ["Side Plank", "Superman Hold", "Leg Raises"] },
  { title: "Strength Fundamentals", type: "strength", durationMin: 60, difficulty: "hard", exercises: ["Bench Press", "Barbell Rows", "Deadlifts"] },
  { title: "Mobility Recharge", type: "mobility", durationMin: 25, difficulty: "easy", exercises: ["Cat Cow", "Hip Circles", "Hamstring Stretch"] },
];

const nutrition = [
  { name: "Chicken Salad", macros: { calories: 400, protein: 35, carbs: 15, fat: 18 }, tags: ["protein", "low-carb"] },
  { name: "Oat Smoothie", macros: { calories: 350, protein: 20, carbs: 40, fat: 10 }, tags: ["breakfast", "energy"] },
  { name: "Brown Rice Bowl", macros: { calories: 500, protein: 25, carbs: 60, fat: 12 }, tags: ["lunch", "balanced"] },
  { name: "Protein Shake", macros: { calories: 200, protein: 30, carbs: 5, fat: 2 }, tags: ["post-workout"] },
  { name: "Avocado Toast", macros: { calories: 280, protein: 8, carbs: 25, fat: 16 }, tags: ["breakfast", "healthy-fat"] },
  { name: "Quinoa Bowl", macros: { calories: 450, protein: 22, carbs: 55, fat: 10 }, tags: ["vegetarian", "lunch"] },
  { name: "Greek Yogurt Parfait", macros: { calories: 300, protein: 18, carbs: 35, fat: 6 }, tags: ["snack", "high-protein"] },
  { name: "Egg Omelette", macros: { calories: 320, protein: 28, carbs: 2, fat: 22 }, tags: ["breakfast", "low-carb"] },
  { name: "Fruit Smoothie Bowl", macros: { calories: 380, protein: 12, carbs: 60, fat: 8 }, tags: ["breakfast", "energy"] },
  { name: "Grilled Salmon", macros: { calories: 450, protein: 40, carbs: 0, fat: 30 }, tags: ["dinner", "omega-3"] },
  { name: "Paneer Tikka", macros: { calories: 400, protein: 32, carbs: 8, fat: 22 }, tags: ["vegetarian", "protein"] },
  { name: "Chickpea Salad", macros: { calories: 370, protein: 15, carbs: 50, fat: 10 }, tags: ["vegan", "fiber-rich"] },
];

const posts = [
  { author: "Kushal", title: "My Transformation Journey", content: "Started from zero, now feeling stronger than ever!", likes: 45 },
  { author: "Maya", title: "Morning Stretch Routines", content: "These mobility workouts really helped my back pain!", likes: 30 },
  { author: "Arjun", title: "Lost 8kg in 3 months!", content: "Consistency, water, and tracking calories are key 🔥", likes: 70 },
  { author: "Sana", title: "Motivation for Beginners", content: "Start small, stay consistent. You’ll see results.", likes: 52 },
  { author: "Ravi", title: "Top 5 Protein Meals", content: "Tried all of these and my recovery has never been better.", likes: 26 },
  { author: "Priya", title: "Yoga for Flexibility", content: "Perfect for unwinding after a long day!", likes: 18 },
  { author: "Nikhil", title: "HIIT vs Strength", content: "I mixed both for amazing results 💥", likes: 62 },
  { author: "Aarav", title: "Gained 6kg Muscle Naturally", content: "Proper food and consistent workouts made it happen.", likes: 41 },
  { author: "Riya", title: "Pre-Workout Meals", content: "Don’t skip your carbs before heavy sessions!", likes: 29 },
  { author: "Divya", title: "Stress and Fitness", content: "Workout really clears your mind. A must for students!", likes: 34 },
  { author: "Karan", title: "Favorite Gym Playlist", content: "Music = Motivation 🔥", likes: 19 },
  { author: "Neha", title: "Meal Prep Tips", content: "Sundays are for planning healthy meals!", likes: 22 },
];

// --- Seed Function ---
const seedDatabase = async () => {
  await connectDB();
  try {
    await User.deleteMany({});
    await Workout.deleteMany({});
    await NutritionItem.deleteMany({});
    await Post.deleteMany({});

    const insertedUsers = await User.insertMany(users);
    const insertedWorkouts = await Workout.insertMany(workouts);
    const insertedNutrition = await NutritionItem.insertMany(nutrition);
    const insertedPosts = await Post.insertMany(posts);

    console.log(`✅ Inserted ${insertedUsers.length} users`);
    console.log(`✅ Inserted ${insertedWorkouts.length} workouts`);
    console.log(`✅ Inserted ${insertedNutrition.length} nutrition items`);
    console.log(`✅ Inserted ${insertedPosts.length} posts`);
    console.log("🎉 AuraFit sample data successfully seeded to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
