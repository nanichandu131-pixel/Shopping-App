import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const forgotPasswordRules = [body('email').isEmail().normalizeEmail()];

export const resetPasswordRules = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
];
