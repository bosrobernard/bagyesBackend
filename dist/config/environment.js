"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.isProduction = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(key, fallback) {
    const value = process.env[key] || fallback;
    if (!value) {
        throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
}
exports.config = {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        uri: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/bagyesrush'),
        testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/bagyesrush_test',
    },
    jwt: {
        secret: requireEnv('JWT_SECRET', 'fallback_secret_key_for_development_only'),
        refreshSecret: requireEnv('JWT_REFRESH_SECRET', 'fallback_refresh_secret_key_for_development_only'),
        expire: process.env.JWT_EXPIRE || '7d',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    },
    email: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
};
exports.isProduction = exports.config.nodeEnv === 'production';
exports.isDevelopment = exports.config.nodeEnv === 'development';
//# sourceMappingURL=environment.js.map