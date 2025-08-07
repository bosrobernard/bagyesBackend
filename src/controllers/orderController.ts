import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/orderService';
import { ApiResponse, CreateOrderRequest, UpdateOrderStatusRequest, PaginationQuery } from '@/types';

export class OrderController {
  static async createOrder(
    req: Request<{}, ApiResponse, CreateOrderRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await OrderService.createOrder(req.body, req.user!.userId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async trackOrder(
    req: Request<{ trackingId: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trackingId } = req.params;
      const order = await OrderService.getOrderByTrackingId(trackingId);

      if (!order) {
         res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(
    req: Request<{ trackingId: string }, ApiResponse, UpdateOrderStatusRequest>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trackingId } = req.params;
      const order = await OrderService.updateOrderStatus(trackingId, req.body, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(
    req: Request<{}, ApiResponse, {}, PaginationQuery>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await OrderService.getOrders(req.query);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: { orders: result.orders },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(
    req: Request<{}, ApiResponse, {}, PaginationQuery>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await OrderService.getOrders(req.query, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: { orders: result.orders },
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStatistics(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const statistics = await OrderService.getOrderStatistics();

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: { statistics },
      });
    } catch (error) {
      next(error);
    }
  }
}