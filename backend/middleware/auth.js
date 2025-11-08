import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT middleware to verify token and attach user to request
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const userId = decoded.sub || decoded.id || decoded._id;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin or trainer
export const requireAdmin = async (req, res, next) => {
  try {
    // First verify token
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const userId = decoded.sub || decoded.id || decoded._id;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'trainer') {
      return res.status(403).json({ success: false, message: 'Admin/Trainer access required' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('Admin authorization error:', err);
    return res.status(401).json({ success: false, message: 'Authorization failed' });
  }
};

