import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected');

    const existingAdmin = await User.findOne({ email: 'prabhat6914@gmail.com' });

    if (existingAdmin) {
      console.log('Admin already exists');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const adminUser = new User({
        name: 'Prabhat Singh',
        email: 'prabhat6914@gmail.com',
        password: hashedPassword,
        mobile: 9999999999,
        role: 'admin',
      });

      await adminUser.save();
      console.log('Admin seeded');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.disconnect();
  }
};

seedAdmin();
