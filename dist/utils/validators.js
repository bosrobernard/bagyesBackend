"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.createOrderSchema = joi_1.default.object({
    senderName: joi_1.default.string().min(2).max(100).required(),
    senderPhone: joi_1.default.string().min(10).max(20).required(),
    senderAddress: joi_1.default.string().min(10).max(500).required(),
    receiverName: joi_1.default.string().min(2).max(100).required(),
    receiverPhone: joi_1.default.string().min(10).max(20).required(),
    receiverAddress: joi_1.default.string().min(10).max(500).required(),
    itemDescription: joi_1.default.string().min(5).max(200).required(),
    itemWeight: joi_1.default.number().min(0).max(1000).optional(),
    itemValue: joi_1.default.number().min(0).max(100000).optional(),
    serviceType: joi_1.default.string().valid('same-day', 'next-day', 'standard', 'express').required(),
    priority: joi_1.default.string().valid('normal', 'high', 'urgent').default('normal'),
    deliveryFee: joi_1.default.number().min(0).max(10000).default(0),
    specialInstructions: joi_1.default.string().max(500).optional(),
});
exports.updateOrderStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled').required(),
    description: joi_1.default.string().max(200).optional(),
});
exports.paginationSchema = joi_1.default.object({
    page: joi_1.default.string().pattern(/^\d+$/).optional(),
    limit: joi_1.default.string().pattern(/^\d+$/).optional(),
    status: joi_1.default.string().valid('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled').optional(),
    search: joi_1.default.string().max(100).optional(),
});
//# sourceMappingURL=validators.js.map