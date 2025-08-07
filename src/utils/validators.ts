import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createOrderSchema = Joi.object({
  senderName: Joi.string().min(2).max(100).required(),
  senderPhone: Joi.string().min(10).max(20).required(),
  senderAddress: Joi.string().min(10).max(500).required(),
  receiverName: Joi.string().min(2).max(100).required(),
  receiverPhone: Joi.string().min(10).max(20).required(),
  receiverAddress: Joi.string().min(10).max(500).required(),
  itemDescription: Joi.string().min(5).max(200).required(),
  itemWeight: Joi.number().min(0).max(1000).optional(),
  itemValue: Joi.number().min(0).max(100000).optional(),
  serviceType: Joi.string().valid('same-day', 'next-day', 'standard', 'express').required(),
  priority: Joi.string().valid('normal', 'high', 'urgent').default('normal'),
  deliveryFee: Joi.number().min(0).max(10000).default(0),
  specialInstructions: Joi.string().max(500).optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled').required(),
  description: Joi.string().max(200).optional(),
});

export const paginationSchema = Joi.object({
  page: Joi.string().pattern(/^\d+$/).optional(),
  limit: Joi.string().pattern(/^\d+$/).optional(),
  status: Joi.string().valid('pending', 'picked-up', 'in-transit', 'delivered', 'cancelled').optional(),
  search: Joi.string().max(100).optional(),
});