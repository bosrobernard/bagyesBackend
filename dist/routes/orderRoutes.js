"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.get('/track/:trackingId', rateLimiter_1.trackingLimiter, orderController_1.OrderController.trackOrder);
router.use(auth_1.authenticate);
router.post('/', (0, validation_1.validate)(validators_1.createOrderSchema), orderController_1.OrderController.createOrder);
router.get('/my-orders', (0, validation_1.validateQuery)(validators_1.paginationSchema), orderController_1.OrderController.getMyOrders);
router.get('/', (0, auth_1.authorize)('admin'), (0, validation_1.validateQuery)(validators_1.paginationSchema), orderController_1.OrderController.getOrders);
router.put('/:trackingId/status', (0, auth_1.authorize)('admin'), (0, validation_1.validate)(validators_1.updateOrderStatusSchema), orderController_1.OrderController.updateOrderStatus);
router.get('/statistics', (0, auth_1.authorize)('admin'), orderController_1.OrderController.getOrderStatistics);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map