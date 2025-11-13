import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderTimeline } from '../types';
import { generateTrackingId } from '../utils/generateTrackingId';
import { logger } from '../utils/logger';

logger.info('Loading Order model file'); // Confirm file is loaded

const timelineSchema = new Schema<IOrderTimeline>({
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  senderPhone: {
    type: String,
    required: true,
    trim: true,
  },
  senderAddress: {
    type: String,
    required: true,
    trim: true,
  },
  receiverName: {
    type: String,
    required: true,
    trim: true,
  },
  receiverPhone: {
    type: String,
    required: true,
    trim: true,
  },
  receiverAddress: {
    type: String,
    required: true,
    trim: true,
  },
  itemDescription: {
    type: String,
    required: true,
    trim: true,
  },
  itemWeight: {
    type: Number,
    min: 0,
  },
  itemValue: {
    type: Number,
    min: 0,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['same-day', 'next-day', 'standard', 'express'],
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal',
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'picked-up', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  timeline: [timelineSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

logger.info('Registering Order schema');

// Combine pre('save') hooks
orderSchema.pre('save', function(next) {
  logger.info('pre(save) hook triggered for Order', { _id: this._id.toString() });
  try {
    if (!this.trackingId) {
      const trackingId = generateTrackingId();
      logger.info('Generated trackingId:', trackingId);
      this.trackingId = trackingId;
    }
    if (this.isNew && this.timeline.length === 0) {
      logger.info('Adding initial timeline entry');
      this.timeline.push({
        status: 'pending',
        description: 'Order created and pending pickup',
        timestamp: new Date(),
      });
    }
    next();
  } catch (error) {
    logger.error('Error in pre(save) hook:', error);
    next(error instanceof Error ? error : new Error('pre(save) hook failed'));
  }
});

// Index for text search
orderSchema.index({
  trackingId: 'text',
  senderName: 'text',
  receiverName: 'text',
  itemDescription: 'text',
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
logger.info('Order model compiled');

export { Order };