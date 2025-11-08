import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

const router = Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Configure multer for file uploads (memory storage for now)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
});

// PUT /api/user/:id/profile-image
// Upload and update user profile image
router.put('/:id/profile-image', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // For now, we'll convert the buffer to a data URL
    // In production, you'd upload to Cloudinary or S3
    const base64Image = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    // Update user with image URL
    // In production, replace this with Cloudinary URL
    user.profileImageUrl = dataUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      imageUrl: dataUrl,
      // For Cloudinary integration, you would return:
      // imageUrl: result.secure_url,
      // url: result.secure_url,
      // secure_url: result.secure_url
    });
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to update profile image' 
    });
  }
});

// GET /api/user/:id
// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        fitnessGoal: user.fitnessGoal,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// PUT /api/user/:id/update-profile
router.put('/:id/update-profile', async (req, res) => {
  try {
    const { id } = req.params;
    const { age, gender, height, weight, goalType, dailyCalorieTarget, fitnessGoal } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goalType !== undefined) user.goalType = goalType;
    if (dailyCalorieTarget !== undefined) user.dailyCalorieTarget = dailyCalorieTarget;
    if (fitnessGoal !== undefined) user.fitnessGoal = fitnessGoal;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goalType: user.goalType,
        dailyCalorieTarget: user.dailyCalorieTarget,
        fitnessGoal: user.fitnessGoal,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

export default router;

