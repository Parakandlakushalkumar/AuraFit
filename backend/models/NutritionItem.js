import mongoose from 'mongoose';

const NutritionItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model('NutritionItem', NutritionItemSchema);
