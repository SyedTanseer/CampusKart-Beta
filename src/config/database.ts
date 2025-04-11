import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campuskart',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 1000
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync without force to preserve existing data
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Database connection failed, retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

export default sequelize; 