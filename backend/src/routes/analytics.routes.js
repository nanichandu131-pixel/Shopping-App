import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';

export const analyticsRouter = Router();
export const adminRouter = Router();

analyticsRouter.post('/events', optionalAuth, analyticsController.track);

adminRouter.use(authenticate, authorize('admin', 'manager'));
adminRouter.get('/dashboard', analyticsController.dashboard);
adminRouter.get('/analytics/searches', analyticsController.searchAnalytics);
adminRouter.get('/analytics/revenue', analyticsController.revenueAnalytics);
adminRouter.get('/users', analyticsController.users);
adminRouter.patch('/users/:id', analyticsController.updateUser);
