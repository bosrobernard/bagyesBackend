import { Request, Response, NextFunction } from 'express';
import { ApiResponse, LoginRequest } from '../types';
export declare class AuthController {
    static login(req: Request<{}, ApiResponse, LoginRequest>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static refreshToken(req: Request<{}, ApiResponse, {
        refreshToken: string;
    }>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getProfile(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map