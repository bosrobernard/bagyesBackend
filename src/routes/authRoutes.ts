import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../utils/validators';

const router = Router();

// Skip authLimiter for OPTIONS requests on /login
router.post('/login', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next(); // Skip rate-limiting for OPTIONS
  }
  return authLimiter(req, res, next);
}, validate(loginSchema), AuthController.login);

router.post('/refresh-token', authLimiter, AuthController.refreshToken);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;