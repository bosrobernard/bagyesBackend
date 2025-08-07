import { IOrder, CreateOrderRequest, UpdateOrderStatusRequest, PaginationQuery } from '../types';
export declare class OrderService {
    static createOrder(orderData: CreateOrderRequest, createdBy: string): Promise<IOrder>;
    static getOrderByTrackingId(trackingId: string): Promise<IOrder | null>;
    static updateOrderStatus(trackingId: string, statusData: UpdateOrderStatusRequest, updatedBy: string): Promise<IOrder>;
    static getOrders(query: PaginationQuery, userId?: string): Promise<{
        orders: IOrder[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    static getOrderStatistics(userId?: string): Promise<{
        total: number;
        pending: number;
        inTransit: number;
        delivered: number;
        cancelled: number;
    }>;
    private static getStatusDescription;
}
//# sourceMappingURL=orderService.d.ts.map