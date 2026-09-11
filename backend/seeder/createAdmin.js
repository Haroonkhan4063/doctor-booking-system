// Run once with: npm run seed:admin
// Since admin can no longer self-register (security fix), this script creates
// the first admin account directly in the database.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

dotenv.config();

const ADMIN_EMAIL = 'admin@doctorbooking.com';
const ADMIN_PASSWORD = 'Admin@123'; // change this after first login

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      console.log('Admin already exists ✅');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`Admin created ✅ — email: ${ADMIN_EMAIL}, password: ${ADMIN_PASSWORD}`);
    process.exit();
  } catch (error) {
    console.error('Failed to create admin ❌', error);
    process.exit(1);
  }
};

createAdmin();
