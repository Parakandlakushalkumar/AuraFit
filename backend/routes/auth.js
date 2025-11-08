import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = Router();

function signToken(user) {
  const payload = { sub: user._id, email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please try again shortly.' });
    }
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const { age, gender, height, weight, goalType, dailyCalorieTarget, fitnessGoal } = req.body;
    const user = await User.create({ 
      name, 
      email, 
      passwordHash,
      age,
      gender,
      height,
      weight,
      goalType: goalType || fitnessGoal || 'General Fitness',
      dailyCalorieTarget,
      fitnessGoal: fitnessGoal || goalType || 'General Fitness',
    });
    const token = signToken(user);
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
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
      } 
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error('Signup error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please try again shortly.' });
    }
    const { email, password, height, weight, fitnessGoal, age, gender, goalType, dailyCalorieTarget } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Update user profile with new information if provided
    if (height || weight || fitnessGoal || age || gender || goalType || dailyCalorieTarget) {
      user.height = height !== undefined ? height : user.height;
      user.weight = weight !== undefined ? weight : user.weight;
      user.fitnessGoal = fitnessGoal || goalType || user.fitnessGoal;
      user.goalType = goalType || fitnessGoal || user.goalType;
      user.age = age !== undefined ? age : user.age;
      user.gender = gender || user.gender;
      user.dailyCalorieTarget = dailyCalorieTarget !== undefined ? dailyCalorieTarget : user.dailyCalorieTarget;
      await user.save();
    }

    const token = signToken(user);
    res.json({ 
      token, 
      user: { 
        id: user._id,
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
      } 
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
