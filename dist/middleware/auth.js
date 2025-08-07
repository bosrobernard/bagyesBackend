"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const User_1 = require("../models/User");
const errorHandler_1 = require("./errorHandler");
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new errorHandler_1.AppError('Not authorized to access this route', 401);
        }
        try {
            const secret = environment_1.config.jwt.secret;
            if (!secret) {
                throw new errorHandler_1.AppError('JWT configuration error', 500);
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw new errorHandler_1.AppError('The user belonging to this token no longer exists', 401);
            }
            req.user = {
                userId: user._id,
                email: user.email,
                role: user.role,
            };
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errorHandler_1.AppError('Invalid token', 401);
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errorHandler_1.AppError('Token expired', 401);
            }
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Not authenticated', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('Not authorized to access this route', 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map