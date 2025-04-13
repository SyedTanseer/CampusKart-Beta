import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb+srv://tanseeracer:mV3De1UOMMwhl4kX@cluster0.favur.mongodb.net/test';

mongoose.set('debug', true);

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      dbName: 'test'
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