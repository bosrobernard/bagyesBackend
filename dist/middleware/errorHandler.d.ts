import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: Error, req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response<ApiResponse>) => void;
//# sourceMappingURL=errorHandler.d.ts.map