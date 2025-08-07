import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { config } from '@/config/environment';
import { AppError } from '@/middleware/errorHandler';
import { IUser, LoginRequest } from '@/types';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpire,
    });
  }

  static async login(loginData: LoginRequest): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const { email, password } = loginData;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 401);
    }

    // Generate tokens
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    return { user, token, refreshToken };
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
      
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      const newToken = this.generateToken(user._id);
      const newRefreshToken = this.generateRefreshToken(user._id);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}