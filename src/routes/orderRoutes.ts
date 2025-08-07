import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validation';
import { trackingLimiter } from '../middleware/rateLimiter';
import { createOrderSchema, updateOrderStatusSchema, paginationSchema } from '../utils/validators';

const router = Router();

// Public routes
router.get('/track/:trackingId', trackingLimiter, OrderController.trackOrder);

// Protected routes
router.use(authenticate);

router.post('/', validate(createOrderSchema), OrderController.createOrder);
router.get('/my-orders', validateQuery(paginationSchema), OrderController.getMyOrders);

// Admin only routes
router.get('/', authorize('admin'), validateQuery(paginationSchema), OrderController.getOrders);
router.put('/:trackingId/status', authorize('admin'), validate(updateOrderStatusSchema), OrderController.updateOrderStatus);
router.get('/statistics', authorize('admin'), OrderController.getOrderStatistics);

export default router;