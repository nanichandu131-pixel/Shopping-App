import { getCache, setCache } from '../utils/cache.js';

export const cacheResponse = (ttlSeconds = 300) => async (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = `http:${req.originalUrl}`;
  const cached = await getCache(key);
  if (cached) return res.json(cached);

  const json = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400) setCache(key, body, ttlSeconds);
    return json(body);
  };
  next();
};
