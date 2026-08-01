import { redis } from '../config/redis.js';

export const getCache = async(key) => {
    if (!redis || redis.status !== 'ready') return null;
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
};

export const setCache = async(key, value, ttlSeconds = 300) => {
    if (!redis || redis.status !== 'ready') return;
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const delCachePattern = async(pattern) => {
    if (!redis || redis.status !== 'ready') return;
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
};