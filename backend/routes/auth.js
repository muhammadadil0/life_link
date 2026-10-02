const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// In-memory fallback store (for offline development only)
const inMemoryUsers = [];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Admin credentials shortcut
  if (cleanEmail === 'admin@gmail.com' && password === 'admin') {
    return res.json({
      success: true,
      message: 'Welcome back, Administrator.',
      user: {
        id: 'admin',
        name: 'System Administrator',
        email: 'admin@gmail.com',
        userType: 'admin'
      },
      token: 'lifelink-admin-token'
    });
  }

  // 1. Try real MongoDB if connected
  if (isDbConnected()) {
    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          return res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              userType: user.userType,
              bloodGroup: user.bloodGroup,
              phone: user.phone,
              address: user.address,
              city: user.city || user.address
            },
            token: `lifelink-token-${user._id}`
          });
        }
      }
    } catch (err) {
      console.error('MongoDB login query error:', err.message);
    }
  }

  // 2. In-memory fallback
  const memUser = inMemoryUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (memUser) {
    return res.json({
      success: true,
      message: `Welcome back, ${memUser.name}!`,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        userType: memUser.userType,
        bloodGroup: memUser.bloodGroup,
        phone: memUser.phone,
        address: memUser.address,
        city: memUser.city
      },
      token: `lifelink-token-${memUser.id}`
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please verify your email and password.'
  });
});

// POST /api/auth/register (Connects to real MongoDB)
router.post('/register', async (req, res) => {
  const {
    userType,
    fullName,
    email,
    phone,
    age,
    bloodGroup,
    address,
    password,
    medicalConditions,
    emergencyContact,
    latitude,
    longitude
  } = req.body;

  // Validation
  if (!userType || !fullName || !email || !phone || !bloodGroup || !address || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.'
    });
  }

  if (userType === 'donor' && !age) {
    return res.status(400).json({
      success: false,
      message: 'Age is required for donor registration.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const detectedCity = address.includes(',') ? address.split(',').pop().trim() : 'Lahore';

  // 1. If real MongoDB is connected, save into MongoDB!
  if (isDbConnected()) {
    try {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Please login instead.'
        });
      }

      const mongoUser = await User.create({
        userType,
        name: fullName.trim(),
        email: cleanEmail,
        password: password, // Mongoose pre-save hook will hash this with bcrypt
        phone: phone.trim(),
        age: age ? parseInt(age, 10) : 30,
        bloodGroup,
        address: address.trim(),
        city: detectedCity,
        medicalConditions: medicalConditions ? medicalConditions.trim() : '',
        emergencyContact: emergencyContact ? emergencyContact.trim() : '',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      });

      console.log('\x1b[32m%s\x1b[0m', `✅ [MongoDB User Registered] Saved new ${userType}: ${mongoUser.name} (${mongoUser.email})`);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Saved to MongoDB database.',
        storage: 'mongodb',
        user: {
          id: mongoUser._id,
          name: mongoUser.name,
          email: mongoUser.email,
          userType: mongoUser.userType,
          bloodGroup: mongoUser.bloodGroup,
          phone: mongoUser.phone,
          address: mongoUser.address
        }
      });
    } catch (dbErr) {
      console.error('MongoDB User.create error:', dbErr);
      if (dbErr.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Database error saving user. Please try again.'
      });
    }
  }

  // 2. In-memory fallback (if MONGODB_URI not yet configured)
  const existingMemUser = inMemoryUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  if (existingMemUser) {
    return res.status(409).json({
      success: false,
      message: 'This email is already registered. Please login instead.'
    });
  }

  const newMemUser = {
    id: `mem-${inMemoryUsers.length + 1}`,
    userType,
    name: fullName.trim(),
    email: cleanEmail,
    password: password,
    phone: phone.trim(),
    age: age ? parseInt(age, 10) : 30,
    bloodGroup,
    address: address.trim(),
    city: detectedCity,
    medicalConditions: medicalConditions ? medicalConditions.trim() : '',
    emergencyContact: emergencyContact ? emergencyContact.trim() : '',
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    createdAt: new Date().toISOString()
  };

  inMemoryUsers.push(newMemUser);

  return res.status(201).json({
    success: true,
    message: 'Registration successful!',
    storage: 'memory-fallback',
    user: {
      id: newMemUser.id,
      name: newMemUser.name,
      email: newMemUser.email,
      userType: newMemUser.userType,
      bloodGroup: newMemUser.bloodGroup,
      phone: newMemUser.phone,
      address: newMemUser.address
    }
  });
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  if (isDbConnected()) {
    try {
      const users = await User.find().select('-password');
      return res.json({
        success: true,
        source: 'mongodb',
        count: users.length,
        data: users
      });
    } catch (e) {
      console.error('Error fetching users from MongoDB:', e.message);
    }
  }

  res.json({
    success: true,
    source: 'in-memory',
    count: inMemoryUsers.length,
    data: inMemoryUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      userType: u.userType,
      bloodGroup: u.bloodGroup,
      address: u.address
    }))
  });
});

// PATCH /api/auth/profile/:id - update user profile (availability, total donations, etc.)
router.patch('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (isDbConnected()) {
    try {
      const allowedFields = ['isAvailable', 'totalDonations', 'phone', 'city', 'address', 'age'];
      const filteredUpdates = {};
      allowedFields.forEach(f => {
        if (updates[f] !== undefined) filteredUpdates[f] = updates[f];
      });

      const updatedUser = await User.findByIdAndUpdate(id, { $set: filteredUpdates }, { new: true }).select('-password');
      if (updatedUser) {
        return res.json({
          success: true,
          message: 'Profile updated successfully!',
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            userType: updatedUser.userType,
            bloodGroup: updatedUser.bloodGroup,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city || updatedUser.address,
            isAvailable: updatedUser.isAvailable,
            totalDonations: updatedUser.totalDonations,
            age: updatedUser.age
          }
        });
      }
    } catch (e) {
      console.error('Error updating user profile in MongoDB:', e.message);
    }
  }

  res.status(404).json({ success: false, message: 'User not found or database unavailable.' });
});

module.exports = router;

