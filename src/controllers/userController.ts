import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import bcrypt from 'bcryptjs';

export class UserController {
  static async createUser(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const user = new User({ name, email, password, role });
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(),
      ]);

      const pages = Math.ceil(total / limit);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: { users },
        pagination: { page, limit, total, pages },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove sensitive fields
      delete updates.password;
      delete updates._id;

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user!.userId;

      const user = await User.findById(userId).select('+password');
      if (!user || !(await user.comparePassword(currentPassword))) {
        throw new AppError('Current password is incorrect', 400);
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}