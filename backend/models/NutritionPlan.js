import mongoose from 'mongoose';

const NutritionPlanSchema = new mongoose.Schema(
  {
    goal: { type: String, required: true, enum: ['Muscle Gain', 'Fat Loss', 'Wellness'] },
    description: { type: String, required: true },
    macros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    meals: [
      {
        mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
        items: [{ type: String }],
        calories: { type: Number, required: true },
      },
    ],
    tips: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('NutritionPlan', NutritionPlanSchema);

