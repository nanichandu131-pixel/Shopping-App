import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details;

  if (error.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    details = Object.values(error.errors).map((item) => item.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource';
    details = error.keyValue;
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  if (statusCode >= 500) {
    logger.error(message, { stack: error.stack, details });
  }

  res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message,
    details
  });
};
