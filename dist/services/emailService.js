"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: environment_1.config.email.host,
            port: environment_1.config.email.port,
            secure: false,
            auth: {
                user: environment_1.config.email.user,
                pass: environment_1.config.email.pass,
            },
        });
    }
    async sendOrderCreatedEmail(order) {
        try {
            if (!environment_1.config.email.user) {
                logger_1.logger.warn('Email service not configured, skipping email notification');
                return;
            }
            const mailOptions = {
                from: `"BagyesRUSH Delivery" <${environment_1.config.email.user}>`,
                to: order.senderName,
                subject: `Order Created - Tracking ID: ${order.trackingId}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #db1313;">Order Created Successfully</h2>
            <p>Dear ${order.senderName},</p>
            <p>Your order has been created successfully. Here are the details:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #db1313;">Order Details</h3>
              <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
              <p><strong>Item:</strong> ${order.itemDescription}</p>
              <p><strong>Service:</strong> ${order.serviceType.replace('-', ' ')}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #db1313;">Delivery Information</h3>
              <p><strong>From:</strong> ${order.senderAddress}</p>
              <p><strong>To:</strong> ${order.receiverAddress}</p>
              <p><strong>Receiver:</strong> ${order.receiverName} (${order.receiverPhone})</p>
            </div>
            
            <p>You can track your order using the tracking ID: <strong>${order.trackingId}</strong></p>
            
            <p>Thank you for choosing BagyesRUSH Delivery!</p>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            logger_1.logger.info(`Order created email sent for tracking ID: ${order.trackingId}`);
        }
        catch (error) {
            logger_1.logger.error('Error sending order created email:', error);
        }
    }
    async sendStatusUpdateEmail(order) {
        try {
            if (!environment_1.config.email.user)
                return;
            const statusMessages = {
                'picked-up': 'Your package has been picked up and is on its way!',
                'in-transit': 'Your package is currently in transit.',
                'delivered': 'Your package has been delivered successfully!',
                'cancelled': 'Your order has been cancelled.',
            };
            const mailOptions = {
                from: `"BagyesRUSH Delivery" <${environment_1.config.email.user}>`,
                to: order.senderName,
                subject: `Order Update - ${order.trackingId}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #db1313;">Order Status Update</h2>
            <p>Dear ${order.senderName},</p>
            <p>${statusMessages[order.status]}</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
              <p><strong>Current Status:</strong> ${order.status.replace('-', ' ').toUpperCase()}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>Thank you for choosing BagyesRUSH Delivery!</p>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            logger_1.logger.info(`Status update email sent for tracking ID: ${order.trackingId}`);
        }
        catch (error) {
            logger_1.logger.error('Error sending status update email:', error);
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map