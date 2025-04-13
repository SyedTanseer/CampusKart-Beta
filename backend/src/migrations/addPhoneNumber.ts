import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb+srv://tanseeracer:mV3De1UOMMwhl4kX@cluster0.favur.mongodb.net/test';

async function addPhoneNumber() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to add phone field with a default value
    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: '' } }
    );

    console.log(`Updated ${result.modifiedCount} users with phone field`);
    
    await mongoose.disconnect();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addPhoneNumber(); 