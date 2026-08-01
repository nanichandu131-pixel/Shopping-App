import http from 'http';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectRedis } from './config/redis.js';

const server = http.createServer(app);

const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down.`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', { error: error.message, stack: error.stack });
  shutdown('unhandledRejection');
});

await connectDatabase();
await connectRedis();

server.listen(env.port, () => {
  logger.info(`SmartPrice API listening on port ${env.port}`);
});
