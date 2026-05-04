import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`Login attempt failed: User not found (${email})`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed: Wrong password for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Admin (Protected by ADMIN_PASSWORD in .env)
router.post('/seed', async (req, res) => {
  const { username, email, password, secret } = req.body;
  
  if (secret !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ 
      username, 
      email, 
      password, 
      role: 'admin' 
    });
    
    await user.save();
    res.status(201).json({ message: 'Admin seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
