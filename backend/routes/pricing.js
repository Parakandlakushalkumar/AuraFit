import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([
    { name: 'Free', price: 0, features: ['Basics'] },
    { name: 'Pro', price: 9, features: ['AI coaching', 'Analytics'] },
    { name: 'Elite', price: 19, features: ['Priority', 'Everything in Pro'] },
  ]);
});

export default router;
