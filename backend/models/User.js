import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    fitnessGoal: { 
      type: String, 
      enum: ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'General Fitness', 'Endurance Training']
    },
    goalType: { 
      type: String, 
      enum: ['Muscle Gain', 'Fat Loss', 'Weight Loss', 'Weight Gain', 'Maintenance', 'General Fitness', 'Endurance Training'],
      default: 'General Fitness'
    },
    dailyCalorieTarget: { type: Number },
    profileImageUrl: { type: String },
    xp: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'trainer'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
