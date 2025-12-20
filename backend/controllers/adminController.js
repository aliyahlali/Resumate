const User = require('../models/User');
const CVHistory = require('../models/CVHistory');

// @desc    Get basic admin stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const clientCount = await User.countDocuments({ role: 'client' });

    // CV Statistics
    const totalCVs = await CVHistory.countDocuments();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCVs = await CVHistory.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const avgCVsPerUser = totalUsers > 0 ? Math.round((totalCVs / totalUsers) * 10) / 10 : 0;

    // Top users by CV count
    const topUsersAggregation = await CVHistory.aggregate([
      {
        $group: {
          _id: '$user',
          cvCount: { $sum: 1 },
        },
      },
      {
        $sort: { cvCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          email: '$userInfo.email',
          cvCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admin: adminCount,
          client: clientCount,
          recent: 0, // Can be calculated if needed
        },
        cvs: {
          total: totalCVs,
          recent: recentCVs,
          avgPerUser: avgCVsPerUser,
        },
        topUsers: topUsersAggregation,
      },
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    // Get CV count for each user
    const usersWithCVCount = await Promise.all(
      users.map(async (user) => {
        const cvCount = await CVHistory.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          cvCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: usersWithCVCount,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'admin' or 'client'.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


