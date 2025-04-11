import sequelize from './config/database';
import User from './models/User';

async function resetDatabase() {
  try {
    // Drop all tables
    await sequelize.drop();
    console.log('All tables dropped successfully');

    // Create tables
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await sequelize.close();
  }
}

resetDatabase(); 