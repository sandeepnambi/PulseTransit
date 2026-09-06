const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'pulsetransit_ultra_secret_jwt_key_tn_2026';

// In-Memory User Store (for seamless fallback mode)
let inMemoryUserStore = [
  {
    id: 'usr-1',
    name: 'Karthik Subramanian',
    email: 'passenger@pulsetransit.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    phone: '+91 98401 55443',
    role: 'PASSENGER',
    agency: 'ALL',
    preferredLanguage: 'en',
    savedRoutes: ['102K', '21G'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'usr-2',
    name: 'Thiru. R. Murugan (MTC Controller)',
    email: 'admin@pulsetransit.com',
    passwordHash: bcrypt.hashSync('adminpassword', 10),
    phone: '+91 94440 99887',
    role: 'FLEET_ADMIN',
    agency: 'MTC',
    preferredLanguage: 'en',
    savedRoutes: ['102K', '21G', '29C'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  }
];

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agency: user.agency
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// 1. POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, agency } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const User = mongoose.models.User;
    if (mongoose.connection.readyState === 1 && User) {
      // Mongoose Database Mode
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '+91 98765 43210',
        role: role || 'PASSENGER',
        agency: agency || 'ALL'
      });

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          agency: user.agency,
          savedRoutes: user.savedRoutes
        }
      });
    } else {
      // In-Memory Mode
      const existingInMemory = inMemoryUserStore.find(u => u.email === normalizedEmail);
      if (existingInMemory) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email: normalizedEmail,
        passwordHash,
        phone: phone || '+91 98765 43210',
        role: role || 'PASSENGER',
        agency: agency || 'ALL',
        savedRoutes: []
      };

      inMemoryUserStore.push(newUser);
      const token = generateToken(newUser);
      return res.json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          agency: newUser.agency,
          savedRoutes: []
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// 2. POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const User = mongoose.models.User;
    if (mongoose.connection.readyState === 1 && User) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          agency: user.agency,
          savedRoutes: user.savedRoutes
        }
      });
    } else {
      const memUser = inMemoryUserStore.find(u => u.email === normalizedEmail);
      if (!memUser) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = bcrypt.compareSync(password, memUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(memUser);
      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone,
          role: memUser.role,
          agency: memUser.agency,
          savedRoutes: memUser.savedRoutes || []
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// 3. GET /api/auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
