import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderTimeline } from '../types';
import { generateTrackingId } from '../utils/generateTrackingId';

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

// Generate tracking ID before saving
orderSchema.pre('save', function(next) {
  if (!this.trackingId) {
    this.trackingId = generateTrackingId();
  }
  next();
});

// Add initial timeline entry before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({
      status: 'pending',
      description: 'Order created and pending pickup',
      timestamp: new Date(),
    });
  }
  next();
});

// Index for text search
orderSchema.index({
  trackingId: 'text',
  senderName: 'text',
  receiverName: 'text',
  itemDescription: 'text',
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);