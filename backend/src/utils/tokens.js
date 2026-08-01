import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });

export const signRefreshToken = (user, tokenVersion) =>
  jwt.sign({ sub: user.id, tokenVersion }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const createOpaqueToken = () => crypto.randomBytes(32).toString('hex');
