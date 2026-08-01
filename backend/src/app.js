import compression from 'compression';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { apiRouter } from './routes/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
    cors({
        origin: env.nodeEnv === 'development' ? true : env.clientUrl,
        credentials: true
    })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(
    morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
    })
);
app.use(apiLimiter);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'smartprice-api', time: new Date().toISOString() });
});

app.use('/api', apiRouter);

// Serve frontend static files when running in production and frontend has been built
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
if (env.nodeEnv === 'production') {
    // Try common locations for a built frontend bundle. When using the optional
    // embed script the frontend is copied to backend/frontend-dist. When using
    // separate frontend container the bundle may live at ../../frontend/dist.
    const candidatePaths = [path.join(__dirname, '../frontend-dist'), path.join(__dirname, '../../frontend/dist')];
    const staticPath = candidatePaths.find((p) => {
        try {
            return fs.existsSync(p);
        } catch {
            return false;
        }
    });

    if (staticPath) {
        app.use(express.static(staticPath));
        app.get('*', (_req, res) => res.sendFile(path.join(staticPath, 'index.html')));
    } else {
        logger.warn('Frontend static bundle not found in production image');
    }
}
app.use(notFound);
app.use(errorHandler);