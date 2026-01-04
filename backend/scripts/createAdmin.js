const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables from the parent (backend) folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    // Ensure MongoDB URI is defined
    if (!mongoUri) {
      console.error('MONGO_URI or MONGODB_URI is not defined in the .env file');
      console.log('Expected .env path:', path.join(__dirname, '..', '.env'));
      console.log('Make sure the .env file exists and contains MONGO_URI=... or MONGODB_URI=...');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Admin email and password
    const adminEmail = process.argv[2] || 'admin@resumate.com';
    const adminPassword = process.argv[3] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`A user with email ${adminEmail} already exists`);
      
      if (existingAdmin.role === 'admin') {
        console.log('This user is already an administrator');
      } else {
        // Update role to admin
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`User ${adminEmail} promoted to administrator`);
      }
    } else {
      // Create a new admin account
      const admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      console.log('Administrator account created successfully!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password: ${adminPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Display help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Admin account creation script

Usage:
  node scripts/createAdmin.js [email] [password]

Arguments:
  email     - Administrator email (default: admin@resumate.com)
  password  - Password (default: admin123)

Examples:
  node scripts/createAdmin.js
  node scripts/createAdmin.js admin@example.com mypassword123
  node scripts/createAdmin.js admin@resumate.com SecurePass456

Note: If the user already exists, their role will be updated to 'admin'
  `);
  process.exit(0);
}

createAdmin();

