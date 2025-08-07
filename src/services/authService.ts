import jwt, { SignOptions } from 'jsonwebtoken'; // Changed import
import { User } from '../models/User';
import { config } from '../config/environment';
import { AppError } from '../middleware/errorHandler';
import { IUser, LoginRequest } from '../types';

export class AuthService {
  static generateToken(userId: string): string {
    const secret = config.jwt.secret;
    if (!secret) {
      throw new AppError('JWT secret is not configured', 500);
    }
    
   
return jwt.sign({ userId }, secret, {
  expiresIn: config.jwt.expire as SignOptions["expiresIn"],
});
  }

  static generateRefreshToken(userId: string): string {
    const refreshSecret = config.jwt.refreshSecret;
    if (!refreshSecret) {
      throw new AppError('JWT refresh secret is not configured', 500);
    }
    
    return jwt.sign({ userId }, refreshSecret, {
      expiresIn: config.jwt.refreshExpire as SignOptions["expiresIn"],
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
      const refreshSecret = config.jwt.refreshSecret;
      if (!refreshSecret) {
        throw new AppError('JWT refresh secret is not configured', 500);
      }

      const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: string };
      
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