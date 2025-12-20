const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes with JWT
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log(`  Access denied: Missing token for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('  Access denied: User not found');
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log(`  Authentication successful: ${req.user.email} (${req.user.role})`);
    next();
  } catch (error) {
    console.log('  Access denied: Invalid or expired token');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Authorize specific roles (e.g., admin)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

