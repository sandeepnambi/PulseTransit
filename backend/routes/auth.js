const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'pulsetransit_ultra_secret_jwt_key_tn_2026';

// Pre-configured Demo Users
const DEMO_USERS = [
  {
    id: 'usr-1',
    name: 'Karthik Subramanian',
    email: 'passenger@pulsetransit.com',
    password: 'password123',
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
    password: 'adminpassword',
    passwordHash: bcrypt.hashSync('adminpassword', 10),
    phone: '+91 94440 99887',
    role: 'FLEET_ADMIN',
    agency: 'MTC',
    preferredLanguage: 'en',
    savedRoutes: ['102K', '21G', '29C'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'usr-3',
    name: 'Thiru. K. Senthil Nathan (Driver)',
    email: 'driver@pulsetransit.com',
    password: 'driverpassword',
    passwordHash: bcrypt.hashSync('driverpassword', 10),
    phone: '+91 94441 87210',
    role: 'DRIVER',
    agency: 'MTC',
    preferredLanguage: 'en',
    savedRoutes: ['102K'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  }
];

// In-Memory User Store (for fallback mode)
let inMemoryUserStore = [...DEMO_USERS];

// Helper to seed demo users into MongoDB if DB is connected
async function seedDatabaseUsers() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    for (const demoUser of DEMO_USERS) {
      const existing = await User.findOne({ email: demoUser.email });
      if (!existing) {
        await User.create({
          name: demoUser.name,
          email: demoUser.email,
          password: demoUser.password,
          phone: demoUser.phone,
          role: demoUser.role,
          agency: demoUser.agency,
          savedRoutes: demoUser.savedRoutes,
          avatarUrl: demoUser.avatarUrl
        });
        console.log(`[Auth DB] Seeded demo user in MongoDB: ${demoUser.email}`);
      }
    }
  } catch (err) {
    console.error('[Auth DB] Error auto-seeding demo users:', err.message);
  }
}

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
    let newUser = null;

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
      }

      const createdUser = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '+91 98765 43210',
        role: role || 'PASSENGER',
        agency: agency || 'ALL'
      });

      newUser = {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
        role: createdUser.role,
        agency: createdUser.agency,
        savedRoutes: createdUser.savedRoutes || []
      };
    } else {
      const existingInMemory = inMemoryUserStore.find(u => u.email === normalizedEmail);
      if (existingInMemory) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const memUser = {
        id: `usr-${Date.now()}`,
        name,
        email: normalizedEmail,
        password,
        passwordHash,
        phone: phone || '+91 98765 43210',
        role: role || 'PASSENGER',
        agency: agency || 'ALL',
        savedRoutes: []
      };

      inMemoryUserStore.push(memUser);
      newUser = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role,
        agency: memUser.agency,
        savedRoutes: []
      };
    }

    const token = generateToken(newUser);
    return res.json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: newUser
    });
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
    // Attempt MongoDB authentication if connection is ready
    if (mongoose.connection.readyState === 1) {
      await seedDatabaseUsers();
      const dbUser = await User.findOne({ email: normalizedEmail });
      if (dbUser) {
        const isMatch = await dbUser.comparePassword(password);
        if (isMatch) {
          const token = generateToken(dbUser);
          return res.json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
              id: dbUser._id,
              name: dbUser.name,
              email: dbUser.email,
              phone: dbUser.phone,
              role: dbUser.role,
              agency: dbUser.agency,
              savedRoutes: dbUser.savedRoutes || []
            }
          });
        }
      }
    }

    // In-Memory authentication fallback (supports demo accounts and local state)
    const memUser = inMemoryUserStore.find(u => u.email === normalizedEmail);
    if (memUser) {
      const isMatch = bcrypt.compareSync(password, memUser.passwordHash);
      if (isMatch) {
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
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
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

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findById(decoded.id).select('-password');
      if (dbUser) {
        return res.json({
          success: true,
          user: {
            id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            agency: dbUser.agency,
            savedRoutes: dbUser.savedRoutes || []
          }
        });
      }
    }

    const memUser = inMemoryUserStore.find(u => u.id === decoded.id || u.email === decoded.email);
    if (memUser) {
      return res.json({
        success: true,
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

    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
