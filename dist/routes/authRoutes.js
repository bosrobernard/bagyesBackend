"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.post('/login', rateLimiter_1.authLimiter, (0, validation_1.validate)(validators_1.loginSchema), authController_1.AuthController.login);
router.post('/refresh-token', rateLimiter_1.authLimiter, authController_1.AuthController.refreshToken);
router.get('/profile', auth_1.authenticate, authController_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map