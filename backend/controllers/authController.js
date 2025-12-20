const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  console.log('POST /api/auth/login - Login attempt');
  try {
    const { email, password } = req.body;
    console.log(`  Email: ${email}`);

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login failed: User not found - ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: Invalid password - ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log(`Login successful for: ${email} (ID: ${user._id}, Role: ${user.role})`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Register user (create an account)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  console.log('POST /api/auth/register - Account creation');
  try {
    const { email, password, role } = req.body;
    console.log(`  Email: ${email}, Role: ${role || 'client'}`);

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log(`Registration failed: User already exists - ${email}`);
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role: role || 'client', // Default 'client', can be 'admin'
    });

    // Generate token
    const token = generateToken(user._id);

    console.log(`Account created successfully: ${email} (ID: ${user._id}, Role: ${user.role})`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  console.log(`GET /api/auth/me - Fetching user profile (ID: ${req.user.id})`);
  try {
    const user = await User.findById(req.user.id);
    console.log(`Profile fetched: ${user.email}`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

