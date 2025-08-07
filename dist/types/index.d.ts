import { Document, Types } from 'mongoose';
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IOrder extends Document {
    _id: string;
    trackingId: string;
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    itemDescription: string;
    itemWeight?: number;
    itemValue?: number;
    serviceType: 'same-day' | 'next-day' | 'standard' | 'express';
    priority: 'normal' | 'high' | 'urgent';
    deliveryFee: number;
    specialInstructions?: string;
    status: 'pending' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled';
    timeline: IOrderTimeline[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrderTimeline {
    status: string;
    description: string;
    timestamp: Date;
}
export interface AuthPayload {
    userId: string;
    email: string;
    role: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface CreateOrderRequest {
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    itemDescription: string;
    itemWeight?: number;
    itemValue?: number;
    serviceType: string;
    priority?: string;
    deliveryFee?: number;
    specialInstructions?: string;
}
export interface UpdateOrderStatusRequest {
    status: string;
    description?: string;
}
export interface PaginationQuery {
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
}
//# sourceMappingURL=index.d.ts.map