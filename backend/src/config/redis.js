import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = env.redisUrl
  ? new Redis(env.redisUrl, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true
    })
  : null;

export const connectRedis = async () => {
  if (!redis) {
    logger.warn('Redis disabled: REDIS_URL is not configured');
    return;
  }

  redis.on('error', (error) => logger.error('Redis error', { error: error.message }));
  await redis.connect();
  logger.info('Redis connected');
};
