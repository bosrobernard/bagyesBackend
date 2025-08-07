"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    try {
        const uri = environment_1.config.nodeEnv === 'test' ? environment_1.config.database.testUri : environment_1.config.database.uri;
        await mongoose_1.default.connect(uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger_1.logger.info(`Connected to MongoDB: ${uri}`);
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected');
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('Disconnected from MongoDB');
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map