import { Router } from 'express';
import Workout from '../models/Workout.js';

const router = Router();

router.get('/', async (req, res) => {
  const items = await Workout.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = await Workout.create(req.body);
  res.status(201).json(item);
});

export default router;
