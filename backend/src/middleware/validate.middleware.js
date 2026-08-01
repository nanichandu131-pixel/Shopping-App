import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Input validation failed', 422, errors.array());
  }
  next();
};
