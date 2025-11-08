import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rewardXP: { type: Number, default: 100 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'active' },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
  },
  { timestamps: true }
);

export default mongoose.model('Challenge', challengeSchema);

