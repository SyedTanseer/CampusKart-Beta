import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'test';

// Verify that MONGODB_URI is defined
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.set('debug', true);

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      dbName: MONGODB_DB_NAME
    });
    
    console.log('Connected to MongoDB');
    console.log('Connected to database:', mongoose.connection.db.databaseName);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('\nUsers in database:', users.length);
    users.forEach(user => {
      console.log(`- ${user.username} (${user._id})`);
    });

    // Check products collection
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log('\nProducts in database:', products.length);
    products.forEach(product => {
      console.log(`- ${product.title} (${product._id})`);
      console.log(`  User ID: ${product.userId}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error checking database:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

checkDatabase(); 