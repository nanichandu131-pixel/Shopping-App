import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

const isProduction = process.env.NODE_ENV === 'production';

for (const key of required) {
  if (isProduction && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartprice_compare',
  redisUrl: process.env.REDIS_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'SmartPrice Compare <noreply@smartprice.local>'
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 250)
  },
  storeTimeoutMs: Number(process.env.STORE_REQUEST_TIMEOUT_MS || 8000)
};
