import { Order } from '@/models/Order';
import { AppError } from '@/middleware/errorHandler';
import { IOrder, CreateOrderRequest, UpdateOrderStatusRequest, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class OrderService {
  static async createOrder(orderData: CreateOrderRequest, createdBy: string): Promise<IOrder> {
    try {
      const order = new Order({
        ...orderData,
        createdBy,
      });

      await order.save();
      logger.info(`Order created: ${order.trackingId}`);
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  static async getOrderByTrackingId(trackingId: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ 
        trackingId: trackingId.toUpperCase() 
      }).populate('createdBy', 'name email');
      
      return order;
    } catch (error) {
      logger.error('Error fetching order by tracking ID:', error);
      throw new AppError('Failed to fetch order', 500);
    }
  }

  static async updateOrderStatus(
    trackingId: string, 
    statusData: UpdateOrderStatusRequest, 
    updatedBy: string
  ): Promise<IOrder> {
    try {
      const order = await Order.findOne({ trackingId: trackingId.toUpperCase() });
      
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Update status and add to timeline
      order.status = statusData.status as any;
      order.timeline.push({
        status: statusData.status,
        description: statusData.description || this.getStatusDescription(statusData.status),
        timestamp: new Date(),
      });

      await order.save();
      logger.info(`Order ${trackingId} status updated to ${statusData.status} by user ${updatedBy}`);
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating order status:', error);
      throw new AppError('Failed to update order status', 500);
    }
  }

  static async getOrders(query: PaginationQuery, userId?: string): Promise<{
    orders: IOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = {};
      
      if (query.status) {
        filter.status = query.status;
      }

      if (query.search) {
        filter.$text = { $search: query.search };
      }

      if (userId) {
        filter.createdBy = userId;
      }

      // Get orders and total count
      const [orders, total] = await Promise.all([
        Order.find(filter)
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments(filter),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        orders,
        pagination: { page, limit, total, pages },
      };
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  static async getOrderStatistics(userId?: string): Promise<{
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  }> {
    try {
      const filter = userId ? { createdBy: userId } : {};

      const [total, pending, inTransit, delivered, cancelled] = await Promise.all([
        Order.countDocuments(filter),
        Order.countDocuments({ ...filter, status: 'pending' }),
        Order.countDocuments({ ...filter, status: 'in-transit' }),
        Order.countDocuments({ ...filter, status: 'delivered' }),
        Order.countDocuments({ ...filter, status: 'cancelled' }),
      ]);

      return { total, pending, inTransit, delivered, cancelled };
    } catch (error) {
      logger.error('Error fetching order statistics:', error);
      throw new AppError('Failed to fetch statistics', 500);
    }
  }

  private static getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      'pending': 'Order created and pending pickup',
      'picked-up': 'Package picked up from sender',
      'in-transit': 'Package is on the way to destination',
      'delivered': 'Package successfully delivered',
      'cancelled': 'Order has been cancelled',
    };
    return descriptions[status] || 'Status updated';
  }
}