import { Request, Response, NextFunction } from 'express';
import { ApiResponse, CreateOrderRequest, UpdateOrderStatusRequest, PaginationQuery } from '../types';
export declare class OrderController {
    static createOrder(req: Request<{}, ApiResponse, CreateOrderRequest>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static trackOrder(req: Request<{
        trackingId: string;
    }>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static updateOrderStatus(req: Request<{
        trackingId: string;
    }, ApiResponse, UpdateOrderStatusRequest>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getOrders(req: Request<{}, ApiResponse, {}, PaginationQuery>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getMyOrders(req: Request<{}, ApiResponse, {}, PaginationQuery>, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
    static getOrderStatistics(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=orderController.d.ts.map