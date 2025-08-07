"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const createUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('admin', 'user').default('user'),
});
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    role: joi_1.default.string().valid('admin', 'user').optional(),
    isActive: joi_1.default.boolean().optional(),
});
const changePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).required(),
});
router.use(auth_1.authenticate);
router.post('/', (0, auth_1.authorize)('admin'), (0, validation_1.validate)(createUserSchema), userController_1.UserController.createUser);
router.get('/', (0, auth_1.authorize)('admin'), userController_1.UserController.getUsers);
router.put('/:id', (0, auth_1.authorize)('admin'), (0, validation_1.validate)(updateUserSchema), userController_1.UserController.updateUser);
router.patch('/:id/deactivate', (0, auth_1.authorize)('admin'), userController_1.UserController.deactivateUser);
router.put('/change-password', (0, validation_1.validate)(changePasswordSchema), userController_1.UserController.changePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map