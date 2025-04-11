import User from '../models/user.model';
import sequelize from '../config/database';

async function testDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create a test user
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      college: 'Test University',
      phone: '1234567890'
    });
    console.log('Created user:', testUser.toJSON());

    // Find user by email
    const foundUser = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('Found user by email:', foundUser?.toJSON());

    // Verify password
    if (foundUser) {
      const isPasswordValid = await foundUser.comparePassword('password123');
      console.log('Password verification:', isPasswordValid);
    }

    // Update user
    if (foundUser) {
      const updatedUser = await foundUser.update({
        name: 'Updated Test User',
        phone: '0987654321'
      });
      console.log('Updated user:', updatedUser.toJSON());
    }

    // Delete user
    if (foundUser) {
      await foundUser.destroy();
      console.log('User deleted successfully');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase(); 