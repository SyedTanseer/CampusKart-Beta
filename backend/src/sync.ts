import sequelize from './config/database';
import User from './models/User';

async function syncDatabase() {
  try {
    // Drop all tables
    await sequelize.drop();
    console.log('All tables dropped successfully');

    // Create all tables
    await sequelize.sync({ force: true });
    console.log('Database tables recreated successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 