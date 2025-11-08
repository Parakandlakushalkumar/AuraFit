import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['strength', 'hiit', 'mobility', 'cardio', 'yoga', 'pilates', 'crossfit', 'calisthenics'], default: 'strength' },
    durationMin: { type: Number, default: 30 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    bodyParts: [{ type: String, enum: ['legs', 'arms', 'upperbody', 'lowerbody', 'chest', 'back', 'abdomen', 'abs', 'shoulders', 'glutes', 'cardio', 'fullbody'] }],
    exercises: [{ name: String, sets: Number, reps: Number }],
    targetMuscles: [String],
    equipment: { type: String, enum: ['dumbbells', 'barbell', 'bodyweight', 'resistance-bands', 'kettlebells', 'cable', 'machine', 'none'], default: 'bodyweight' },
    caloriesPerMin: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model('Workout', WorkoutSchema);
