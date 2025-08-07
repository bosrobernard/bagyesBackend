"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const generateTrackingId_1 = require("../utils/generateTrackingId");
const timelineSchema = new mongoose_1.Schema({
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
const orderSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
orderSchema.pre('save', function (next) {
    if (!this.trackingId) {
        this.trackingId = (0, generateTrackingId_1.generateTrackingId)();
    }
    next();
});
orderSchema.pre('save', function (next) {
    if (this.isNew && this.timeline.length === 0) {
        this.timeline.push({
            status: 'pending',
            description: 'Order created and pending pickup',
            timestamp: new Date(),
        });
    }
    next();
});
orderSchema.index({
    trackingId: 'text',
    senderName: 'text',
    receiverName: 'text',
    itemDescription: 'text',
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map