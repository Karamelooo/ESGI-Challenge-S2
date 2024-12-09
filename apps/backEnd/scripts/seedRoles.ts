import mongoose from 'mongoose';
import Role from '../src/models/role.model';
import User from '../src/models/user.model';

const runTest = async () => {
  try {
    await mongoose.connect('mongodb://esgi:esgi@localhost:27017');
    console.log('Connected to the database.');

    // Create roles
    const roles = ['admin', 'user', 'comptable'];
    for (const roleName of roles) {
      let role = await Role.findOne({ name: roleName });
      if (!role) {
        role = await Role.create({ name: roleName, label: roleName });
        console.log(`Role created: ${roleName}`);
      } else {
        console.log(`Role already exists: ${roleName}`);
      }
    }

    // Create test user
    const testUser = await User.findOne({ username: 'testuser' });
    if (!testUser) {
      const newUser = await User.create({
        username: 'testuser22222',
        email: 'testuser12345@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'password', 
        roles: ['admin'], 
      });
      console.log('Test user created:', newUser);
    } else {
      console.log('Test user already exists:', testUser);
    }

    mongoose.connection.close();
    console.log('Script completed successfully.');
  } catch (err) {
    console.error('Error during test script:', err);
    mongoose.connection.close();
  }
};

runTest();
