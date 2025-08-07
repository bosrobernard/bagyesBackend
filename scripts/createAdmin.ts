import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { User } from '../src/models/User';
import { logger } from '../src/utils/logger';

const createAdminUser = async () => {
  try {
    await connectDatabase();
    
    const adminExists = await User.findOne({ email: 'admin@bagyesrush.com' });
    
    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@bagyesrush.com',
      password: 'admin123',
      role: 'admin',
    });

    await admin.save();
    logger.info('Admin user created successfully');
    
  } catch (error) {
    logger.error('Error creating admin user:', error);
  } finally {
    await disconnectDatabase();
  }
};

createAdminUser();