import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['planned', 'completed', 'missed'], default: 'planned' },
    notes: { type: String },
    caloriesBurned: { type: Number },
    durationMin: { type: Number },
    bodyParts: [{ type: String }], // Track which body parts were worked
    setsCompleted: { type: Number },
    repsCompleted: { type: Number },
    weightUsed: { type: Number },
    intensity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  { timestamps: true }
);

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
