import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { User } from '../src/models/User';
import { Order } from '../src/models/Order';
import { logger } from '../src/utils/logger';

const seedDatabase = async () => {
  try {
    await connectDatabase();
    
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@bagyesrush.com' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@bagyesrush.com',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      logger.info('Admin user created');
    }

    // Create test user
    const userExists = await User.findOne({ email: 'user@example.com' });
    
    if (!userExists) {
      const user = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
      });
      await user.save();
      logger.info('Test user created');
    }

    // Create sample orders for testing
    const orderCount = await Order.countDocuments();
    
    if (orderCount === 0) {
      const admin = await User.findOne({ email: 'admin@bagyesrush.com' });
      
      const sampleOrders = [
        {
          senderName: 'John Doe',
          senderPhone: '+233123456789',
          senderAddress: 'Accra, Ghana',
          receiverName: 'Jane Smith',
          receiverPhone: '+233987654321',
          receiverAddress: 'Tema, Ghana',
          itemDescription: 'Electronics Package',
          serviceType: 'same-day',
          priority: 'high',
          deliveryFee: 25.00,
          status: 'pending',
          createdBy: admin?._id,
        },
        {
          senderName: 'Alice Johnson',
          senderPhone: '+233111222333',
          senderAddress: 'Kumasi, Ghana',
          receiverName: 'Bob Wilson',
          receiverPhone: '+233444555666',
          receiverAddress: 'Accra, Ghana',
          itemDescription: 'Documents',
          serviceType: 'next-day',
          priority: 'normal',
          deliveryFee: 15.00,
          status: 'delivered',
          createdBy: admin?._id,
        },
      ];

      for (const orderData of sampleOrders) {
        const order = new Order(orderData);
        await order.save();
      }
      
      logger.info('Sample orders created');
    }

    logger.info('Database seeding completed successfully');
    
  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await disconnectDatabase();
  }
};

seedDatabase();