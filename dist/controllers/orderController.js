"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const orderService_1 = require("../services/orderService");
class OrderController {
    static async createOrder(req, res, next) {
        try {
            const order = await orderService_1.OrderService.createOrder(req.body, req.user.userId);
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: { order },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async trackOrder(req, res, next) {
        try {
            const { trackingId } = req.params;
            const order = await orderService_1.OrderService.getOrderByTrackingId(trackingId);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async updateOrderStatus(req, res, next) {
        try {
            const { trackingId } = req.params;
            const order = await orderService_1.OrderService.updateOrderStatus(trackingId, req.body, req.user.userId);
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: { order },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrders(req, res, next) {
        try {
            const result = await orderService_1.OrderService.getOrders(req.query);
            res.status(200).json({
                success: true,
                message: 'Orders retrieved successfully',
                data: { orders: result.orders },
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyOrders(req, res, next) {
        try {
            const result = await orderService_1.OrderService.getOrders(req.query, req.user.userId);
            res.status(200).json({
                success: true,
                message: 'Orders retrieved successfully',
                data: { orders: result.orders },
                pagination: result.pagination,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getOrderStatistics(req, res, next) {
        try {
            const statistics = await orderService_1.OrderService.getOrderStatistics();
            res.status(200).json({
                success: true,
                message: 'Statistics retrieved successfully',
                data: { statistics },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map