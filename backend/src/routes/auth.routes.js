import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { forgotPasswordRules, loginRules, registerRules, resetPasswordRules } from '../validators/auth.validators.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, registerRules, validate, authController.register);
authRouter.post('/login', authLimiter, loginRules, validate, authController.login);
authRouter.post('/refresh', body('refreshToken').notEmpty(), validate, authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get('/me', authenticate, authController.me);
authRouter.post('/verify-email', body('token').notEmpty(), validate, authController.verifyEmail);
authRouter.post('/forgot-password', authLimiter, forgotPasswordRules, validate, authController.forgotPassword);
authRouter.post('/reset-password', authLimiter, resetPasswordRules, validate, authController.resetPassword);
