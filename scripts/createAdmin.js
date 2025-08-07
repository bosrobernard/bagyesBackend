"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const User_1 = require("../src/models/User");
const logger_1 = require("../src/utils/logger");
const createAdminUser = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const adminExists = await User_1.User.findOne({ email: 'admin@bagyesrush.com' });
        if (adminExists) {
            logger_1.logger.info('Admin user already exists');
            return;
        }
        const admin = new User_1.User({
            name: 'Admin User',
            email: 'admin@bagyesrush.com',
            password: 'admin123',
            role: 'admin',
        });
        await admin.save();
        logger_1.logger.info('Admin user created successfully');
    }
    catch (error) {
        logger_1.logger.error('Error creating admin user:', error);
    }
    finally {
        await (0, database_1.disconnectDatabase)();
    }
};
createAdminUser();
//# sourceMappingURL=createAdmin.js.map