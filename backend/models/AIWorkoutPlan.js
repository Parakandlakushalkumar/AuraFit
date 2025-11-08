import mongoose from 'mongoose';

const aiWorkoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    equipment: { type: String, required: true },
    plan: {
      title: String,
      durationMin: Number,
      exercises: [String],
      intensity: String,
      description: String,
    },
    dateCreated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('AIWorkoutPlan', aiWorkoutPlanSchema);

