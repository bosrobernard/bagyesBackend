
import nodemailer from 'nodemailer';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { IOrder } from '@/types';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendOrderCreatedEmail(order: IOrder): Promise<void> {
    try {
      if (!config.email.user) {
        logger.warn('Email service not configured, skipping email notification');
        return;
      }

      const mailOptions = {
        from: `"BagyesRUSH Delivery" <${config.email.user}>`,
        to: order.senderName, // You might want to add sender email to order model
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
      logger.info(`Order created email sent for tracking ID: ${order.trackingId}`);
    } catch (error) {
      logger.error('Error sending order created email:', error);
    }
  }

  async sendStatusUpdateEmail(order: IOrder): Promise<void> {
    try {
      if (!config.email.user) return;

      const statusMessages = {
        'picked-up': 'Your package has been picked up and is on its way!',
        'in-transit': 'Your package is currently in transit.',
        'delivered': 'Your package has been delivered successfully!',
        'cancelled': 'Your order has been cancelled.',
      };

      const mailOptions = {
        from: `"BagyesRUSH Delivery" <${config.email.user}>`,
        to: order.senderName,
        subject: `Order Update - ${order.trackingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #db1313;">Order Status Update</h2>
            <p>Dear ${order.senderName},</p>
            <p>${statusMessages[order.status as keyof typeof statusMessages]}</p>
            
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
      logger.info(`Status update email sent for tracking ID: ${order.trackingId}`);
    } catch (error) {
      logger.error('Error sending status update email:', error);
    }
  }
}

export const emailService = new EmailService();