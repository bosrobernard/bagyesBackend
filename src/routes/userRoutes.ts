import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// User validation schemas
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').default('user'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  role: Joi.string().valid('admin', 'user').optional(),
  isActive: Joi.boolean().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

// Protected routes
router.use(authenticate);

// Admin only routes
router.post('/', authorize('admin'), validate(createUserSchema), UserController.createUser);
router.get('/', authorize('admin'), UserController.getUsers);
router.put('/:id', authorize('admin'), validate(updateUserSchema), UserController.updateUser);
router.patch('/:id/deactivate', authorize('admin'), UserController.deactivateUser);

// User routes
router.put('/change-password', validate(changePasswordSchema), UserController.changePassword);

export default router;