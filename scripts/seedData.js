"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const User_1 = require("../src/models/User");
const Order_1 = require("../src/models/Order");
const logger_1 = require("../src/utils/logger");
const seedDatabase = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const adminExists = await User_1.User.findOne({ email: 'admin@bagyesrush.com' });
        if (!adminExists) {
            const admin = new User_1.User({
                name: 'Admin User',
                email: 'admin@bagyesrush.com',
                password: 'admin123',
                role: 'admin',
            });
            await admin.save();
            logger_1.logger.info('Admin user created');
        }
        const userExists = await User_1.User.findOne({ email: 'user@example.com' });
        if (!userExists) {
            const user = new User_1.User({
                name: 'Test User',
                email: 'user@example.com',
                password: 'user123',
                role: 'user',
            });
            await user.save();
            logger_1.logger.info('Test user created');
        }
        const orderCount = await Order_1.Order.countDocuments();
        if (orderCount === 0) {
            const admin = await User_1.User.findOne({ email: 'admin@bagyesrush.com' });
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
                const order = new Order_1.Order(orderData);
                await order.save();
            }
            logger_1.logger.info('Sample orders created');
        }
        logger_1.logger.info('Database seeding completed successfully');
    }
    catch (error) {
        logger_1.logger.error('Error seeding database:', error);
    }
    finally {
        await (0, database_1.disconnectDatabase)();
    }
};
seedDatabase();
//# sourceMappingURL=seedData.js.map