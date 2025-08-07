"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const errorHandler_1 = require("../middleware/errorHandler");
class UserController {
    static async createUser(req, res, next) {
        try {
            const { name, email, password, role = 'user' } = req.body;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                throw new errorHandler_1.AppError('User with this email already exists', 400);
            }
            const user = new User_1.User({ name, email, password, role });
            await user.save();
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [users, total] = await Promise.all([
                User_1.User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
                User_1.User.countDocuments(),
            ]);
            const pages = Math.ceil(total / limit);
            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: { users },
                pagination: { page, limit, total, pages },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;
            delete updates.password;
            delete updates._id;
            const user = await User_1.User.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            });
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.userId;
            const user = await User_1.User.findById(userId).select('+password');
            if (!user || !(await user.comparePassword(currentPassword))) {
                throw new errorHandler_1.AppError('Current password is incorrect', 400);
            }
            user.password = newPassword;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Password changed successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deactivateUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User_1.User.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                message: 'User deactivated successfully',
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map