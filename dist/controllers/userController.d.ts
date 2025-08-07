import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class UserController {
    static createUser(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getUsers(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static updateUser(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static changePassword(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static deactivateUser(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map