import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw new AppError('Authentication required', 401);

  const payload = jwt.verify(token, env.jwtAccessSecret);
  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'active') throw new AppError('User is not authorized', 401);

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = await User.findById(payload.sub);
  } catch {
    req.user = null;
  }
  next();
});

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
