import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ApiResponse, LoginRequest } from '../types';

export class AuthController {
  static async login(
    req: Request<{}, ApiResponse, LoginRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, token, refreshToken } = await AuthService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: Request<{}, ApiResponse, { refreshToken: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      // TypeScript should now recognize req.user
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user: req.user },
      });
    } catch (error) {
      next(error);
    }
  }
}