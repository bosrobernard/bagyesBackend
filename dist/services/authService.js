"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const environment_1 = require("../config/environment");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthService {
    static generateToken(userId) {
        const secret = environment_1.config.jwt.secret;
        if (!secret) {
            throw new errorHandler_1.AppError('JWT secret is not configured', 500);
        }
        return jsonwebtoken_1.default.sign({ userId }, secret, {
            expiresIn: environment_1.config.jwt.expire,
        });
    }
    static generateRefreshToken(userId) {
        const refreshSecret = environment_1.config.jwt.refreshSecret;
        if (!refreshSecret) {
            throw new errorHandler_1.AppError('JWT refresh secret is not configured', 500);
        }
        return jsonwebtoken_1.default.sign({ userId }, refreshSecret, {
            expiresIn: environment_1.config.jwt.refreshExpire,
        });
    }
    static async login(loginData) {
        const { email, password } = loginData;
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        if (!user.isActive) {
            throw new errorHandler_1.AppError('Your account has been deactivated', 401);
        }
        const token = this.generateToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);
        return { user, token, refreshToken };
    }
    static async refreshToken(refreshToken) {
        try {
            const refreshSecret = environment_1.config.jwt.refreshSecret;
            if (!refreshSecret) {
                throw new errorHandler_1.AppError('JWT refresh secret is not configured', 500);
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new errorHandler_1.AppError('Invalid refresh token', 401);
            }
            const newToken = this.generateToken(user._id);
            const newRefreshToken = this.generateRefreshToken(user._id);
            return { token: newToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new errorHandler_1.AppError('Invalid refresh token', 401);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map