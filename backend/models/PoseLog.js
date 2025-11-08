import mongoose from 'mongoose';

const poseLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: String, required: true },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number }, // seconds
    keypoints: { type: mongoose.Schema.Types.Mixed }, // Store pose keypoints if needed
  },
  { timestamps: true }
);

export default mongoose.model('PoseLog', poseLogSchema);

