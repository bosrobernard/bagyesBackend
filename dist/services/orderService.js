"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class OrderService {
    static async createOrder(orderData, createdBy) {
        try {
            const order = new Order_1.Order({
                ...orderData,
                createdBy,
            });
            await order.save();
            logger_1.logger.info(`Order created: ${order.trackingId}`);
            return order;
        }
        catch (error) {
            logger_1.logger.error('Error creating order:', error);
            throw new errorHandler_1.AppError('Failed to create order', 500);
        }
    }
    static async getOrderByTrackingId(trackingId) {
        try {
            const order = await Order_1.Order.findOne({
                trackingId: trackingId.toUpperCase()
            }).populate('createdBy', 'name email');
            return order;
        }
        catch (error) {
            logger_1.logger.error('Error fetching order by tracking ID:', error);
            throw new errorHandler_1.AppError('Failed to fetch order', 500);
        }
    }
    static async updateOrderStatus(trackingId, statusData, updatedBy) {
        try {
            const order = await Order_1.Order.findOne({ trackingId: trackingId.toUpperCase() });
            if (!order) {
                throw new errorHandler_1.AppError('Order not found', 404);
            }
            order.status = statusData.status;
            order.timeline.push({
                status: statusData.status,
                description: statusData.description || this.getStatusDescription(statusData.status),
                timestamp: new Date(),
            });
            await order.save();
            logger_1.logger.info(`Order ${trackingId} status updated to ${statusData.status} by user ${updatedBy}`);
            return order;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            logger_1.logger.error('Error updating order status:', error);
            throw new errorHandler_1.AppError('Failed to update order status', 500);
        }
    }
    static async getOrders(query, userId) {
        try {
            const page = parseInt(query.page || '1');
            const limit = parseInt(query.limit || '10');
            const skip = (page - 1) * limit;
            const filter = {};
            if (query.status) {
                filter.status = query.status;
            }
            if (query.search) {
                filter.$text = { $search: query.search };
            }
            if (userId) {
                filter.createdBy = userId;
            }
            const [orders, total] = await Promise.all([
                Order_1.Order.find(filter)
                    .populate('createdBy', 'name email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Order_1.Order.countDocuments(filter),
            ]);
            const pages = Math.ceil(total / limit);
            return {
                orders,
                pagination: { page, limit, total, pages },
            };
        }
        catch (error) {
            logger_1.logger.error('Error fetching orders:', error);
            throw new errorHandler_1.AppError('Failed to fetch orders', 500);
        }
    }
    static async getOrderStatistics(userId) {
        try {
            const filter = userId ? { createdBy: userId } : {};
            const [total, pending, inTransit, delivered, cancelled] = await Promise.all([
                Order_1.Order.countDocuments(filter),
                Order_1.Order.countDocuments({ ...filter, status: 'pending' }),
                Order_1.Order.countDocuments({ ...filter, status: 'in-transit' }),
                Order_1.Order.countDocuments({ ...filter, status: 'delivered' }),
                Order_1.Order.countDocuments({ ...filter, status: 'cancelled' }),
            ]);
            return { total, pending, inTransit, delivered, cancelled };
        }
        catch (error) {
            logger_1.logger.error('Error fetching order statistics:', error);
            throw new errorHandler_1.AppError('Failed to fetch statistics', 500);
        }
    }
    static getStatusDescription(status) {
        const descriptions = {
            'pending': 'Order created and pending pickup',
            'picked-up': 'Package picked up from sender',
            'in-transit': 'Package is on the way to destination',
            'delivered': 'Package successfully delivered',
            'cancelled': 'Order has been cancelled',
        };
        return descriptions[status] || 'Status updated';
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=orderService.js.map