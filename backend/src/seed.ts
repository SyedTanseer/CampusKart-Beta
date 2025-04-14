import mongoose from 'mongoose';
import User from './models/User';
import Product from './models/Product';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/campuskart';
const DB_NAME = process.env.MONGODB_DB_NAME ?? 'test';

mongoose.set('debug', true); // Enable debug logging

const sampleProducts = [
  // Textbooks
  {
    title: 'Calculus Early Transcendentals 8th Edition',
    description: 'Like new condition, barely used. Includes all chapters and practice problems.',
    price: 45.99,
    category: 'textbooks',
    condition: 'like new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Organic Chemistry 2nd Edition',
    description: 'Excellent condition, highlighted in some chapters. Perfect for CHEM 301.',
    price: 65.00,
    category: 'textbooks',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Introduction to Algorithms',
    description: 'CS major essential. Some wear but all pages intact.',
    price: 55.50,
    category: 'textbooks',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Physics for Scientists and Engineers',
    description: 'Latest edition, includes online access code.',
    price: 75.00,
    category: 'textbooks',
    condition: 'new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Microeconomics Principles',
    description: 'Great condition, perfect for ECON 101.',
    price: 40.00,
    category: 'textbooks',
    condition: 'like new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },

  // Electronics
  {
    title: 'MacBook Pro 2021',
    description: 'M1 Pro chip, 16GB RAM, 512GB SSD. Perfect condition.',
    price: 1299.99,
    category: 'electronics',
    condition: 'like new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'iPhone 13 Pro',
    description: '256GB, Sierra Blue. Includes original box and accessories.',
    price: 799.99,
    category: 'electronics',
    condition: 'like new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Noise cancelling, excellent sound quality.',
    price: 249.99,
    category: 'electronics',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'iPad Air 4th Gen',
    description: '64GB, Space Gray. Includes Apple Pencil.',
    price: 449.99,
    category: 'electronics',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Dell XPS 15 Laptop',
    description: 'i7 processor, 16GB RAM, 1TB SSD. Great for students.',
    price: 999.99,
    category: 'electronics',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },

  // Furniture
  {
    title: 'IKEA Desk',
    description: 'White, good condition. Perfect for dorm room.',
    price: 45.00,
    category: 'furniture',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Office Chair',
    description: 'Ergonomic, adjustable height. Great for long study sessions.',
    price: 75.00,
    category: 'furniture',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Bookshelf',
    description: 'Wooden, 5 shelves. Perfect for textbooks and decor.',
    price: 35.00,
    category: 'furniture',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Mini Fridge',
    description: 'Compact, energy efficient. Great for dorm rooms.',
    price: 60.00,
    category: 'furniture',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Bedside Table',
    description: 'Wooden, includes drawer. Perfect for small spaces.',
    price: 25.00,
    category: 'furniture',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },

  // Clothing
  {
    title: 'University Hoodie',
    description: 'Size L, school colors. Great condition.',
    price: 35.00,
    category: 'clothing',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Nike Running Shoes',
    description: 'Size 10, barely used. Great for campus walking.',
    price: 45.00,
    category: 'clothing',
    condition: 'like new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Leather Jacket',
    description: 'Size M, genuine leather. Perfect for fall semester.',
    price: 85.00,
    category: 'clothing',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Jeans',
    description: 'Size 32x32, dark wash. Great condition.',
    price: 25.00,
    category: 'clothing',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Winter Coat',
    description: 'Size L, waterproof. Perfect for cold weather.',
    price: 55.00,
    category: 'clothing',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },

  // Other
  {
    title: 'Coffee Maker',
    description: '4-cup, perfect for dorm room. Includes filters.',
    price: 15.00,
    category: 'other',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Desk Lamp',
    description: 'LED, adjustable brightness. Great for studying.',
    price: 12.00,
    category: 'other',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Backpack',
    description: 'Waterproof, laptop compartment. Great for campus.',
    price: 35.00,
    category: 'other',
    condition: 'good',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Water Bottle',
    description: 'Stainless steel, 32oz. Keeps drinks cold for hours.',
    price: 10.00,
    category: 'other',
    condition: 'new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  },
  {
    title: 'Whiteboard',
    description: '24x36 inches, includes markers and eraser.',
    price: 20.00,
    category: 'other',
    condition: 'new',
    images: ['https://images-na.ssl-images-amazon.com/images/I/51Q1vXEcn-L._SX258_BO1,204,203,200_.jpg'],
    seller: new Types.ObjectId('67f9935a960d25a1e53c68df')
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('Connection URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      dbName: DB_NAME // Use environment variable with fallback
    });
    
    console.log('Connected to MongoDB');
    console.log('Connected to database:', mongoose.connection.db.databaseName);

    // Ensure indexes are created
    console.log('Creating indexes...');
    await Promise.all([
      User.createIndexes(),
      Product.createIndexes()
    ]);
    console.log('Indexes created successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    const deletedUsers = await User.deleteMany({});
    const deletedProducts = await Product.deleteMany({});
    console.log(`Cleared ${deletedUsers.deletedCount} users and ${deletedProducts.deletedCount} products`);

    // Create mock users
    console.log('Creating mock users...');
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'John Doe',
        profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg',
        user_type: 'normal'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Jane Smith',
        profile_picture: 'https://randomuser.me/api/portraits/women/1.jpg',
        user_type: 'normal'
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Mike Wilson',
        profile_picture: 'https://randomuser.me/api/portraits/men/2.jpg',
        user_type: 'normal'
      },
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        profile_picture: 'https://randomuser.me/api/portraits/men/3.jpg',
        user_type: 'admin'
      },
      {
        username: 'dev_user',
        email: 'dev@example.com',
        password: await bcrypt.hash('dev123', 10),
        name: 'Developer User',
        profile_picture: 'https://randomuser.me/api/portraits/women/2.jpg',
        user_type: 'developer'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created with IDs:`, createdUsers.map(u => u._id));

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');

    // Verify the data was inserted
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`);

    console.log('Database seeded successfully!');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error in seed script:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit(1);
  }
};

// Start the seeding process
seedDatabase(); 