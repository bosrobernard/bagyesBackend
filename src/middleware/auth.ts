import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { User } from '@/models/User';
import { AppError } from './errorHandler';
import { AuthPayload } from '@/types';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;
      
      // Check if user still exists
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AppError('The user belonging to this token no longer exists', 401);
      }

      // Grant access to protected route
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      throw new AppError('Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this route', 403));
    }

    next();
  };
};