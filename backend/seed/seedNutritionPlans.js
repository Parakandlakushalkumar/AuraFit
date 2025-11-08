import mongoose from "mongoose";
import dotenv from "dotenv";
import NutritionPlan from "../models/NutritionPlan.js";

dotenv.config();

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

const nutritionPlans = [
  {
    goal: "Muscle Gain",
    description: "High-protein plans with smart calorie surplus.",
    macros: {
      calories: 2800,
      protein: 180,
      carbs: 300,
      fat: 80,
    },
    meals: [
      {
        mealType: "Breakfast",
        items: [
          "Oats with milk, banana, and whey protein",
          "2 boiled eggs"
        ],
        calories: 550,
      },
      {
        mealType: "Lunch",
        items: [
          "Grilled chicken breast (150g)",
          "Steamed rice (1 cup)",
          "Mixed veggies"
        ],
        calories: 700,
      },
      {
        mealType: "Snack",
        items: [
          "Peanut butter sandwich",
          "Greek yogurt"
        ],
        calories: 400,
      },
      {
        mealType: "Dinner",
        items: [
          "Paneer or Tofu (150g)",
          "Whole wheat chapati (2)",
          "Vegetable curry"
        ],
        calories: 600,
      },
    ],
    tips: [
      "Eat every 3–4 hours to maintain anabolic state.",
      "Focus on compound lifts and progressive overload.",
      "Stay hydrated and sleep 7–8 hours daily.",
    ],
  },
  {
    goal: "Fat Loss",
    description: "Balanced deficits with nutrient-dense meals.",
    macros: {
      calories: 1800,
      protein: 130,
      carbs: 150,
      fat: 55,
    },
    meals: [
      {
        mealType: "Breakfast",
        items: [
          "Scrambled eggs (3 whites, 1 yolk)",
          "Avocado toast (1 slice)",
          "Black coffee or green tea"
        ],
        calories: 350,
      },
      {
        mealType: "Lunch",
        items: [
          "Grilled fish or chicken (100g)",
          "Quinoa salad with vegetables"
        ],
        calories: 500,
      },
      {
        mealType: "Snack",
        items: [
          "Apple or mixed nuts (small handful)"
        ],
        calories: 200,
      },
      {
        mealType: "Dinner",
        items: [
          "Vegetable soup",
          "Tofu or Paneer stir-fry (100g)"
        ],
        calories: 450,
      },
    ],
    tips: [
      "Avoid sugary beverages and refined carbs.",
      "Increase fiber intake for satiety.",
      "Include at least 30 minutes of cardio 5 days a week.",
    ],
  },
  {
    goal: "Wellness",
    description: "Clean eating with flexible lifestyle choices.",
    macros: {
      calories: 2200,
      protein: 120,
      carbs: 220,
      fat: 70,
    },
    meals: [
      {
        mealType: "Breakfast",
        items: [
          "Smoothie bowl (berries, oats, Greek yogurt)",
          "Green tea"
        ],
        calories: 400,
      },
      {
        mealType: "Lunch",
        items: [
          "Vegetable stir-fry with tofu or chicken",
          "Brown rice or quinoa"
        ],
        calories: 600,
      },
      {
        mealType: "Snack",
        items: [
          "Mixed fruits and almonds"
        ],
        calories: 250,
      },
      {
        mealType: "Dinner",
        items: [
          "Grilled veggies",
          "Lentil soup",
          "Whole wheat roti (1)"
        ],
        calories: 500,
      },
    ],
    tips: [
      "Maintain a consistent sleep schedule.",
      "Practice mindfulness or yoga 3x per week.",
      "Stay active throughout the day — 8k–10k steps.",
    ],
  },
];

const seedNutritionPlans = async () => {
  await connectDB();
  try {
    await NutritionPlan.deleteMany({});
    console.log("🗑️ Cleared existing Nutrition Plans.");

    const inserted = await NutritionPlan.insertMany(nutritionPlans);
    console.log(`✅ Inserted ${inserted.length} nutrition plans.`);
    console.log("🎉 Nutrition plans successfully seeded!");
  } catch (err) {
    console.error("❌ Seeding nutrition plans failed:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedNutritionPlans();

