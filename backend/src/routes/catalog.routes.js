import { Router } from 'express';
import { brandController, categoryController, storeController } from '../controllers/catalog.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { cacheResponse } from '../middleware/cache.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { mongoIdParam, paginationRules } from '../validators/common.validators.js';

const crudRoutes = (controller, adminRoles = ['admin', 'manager']) => {
  const router = Router();
  router.get('/', paginationRules, validate, cacheResponse(300), controller.list);
  router.post('/', authenticate, authorize(...adminRoles), controller.create);
  router.get('/:id', mongoIdParam(), validate, controller.get);
  router.patch('/:id', authenticate, authorize(...adminRoles), mongoIdParam(), validate, controller.update);
  router.delete('/:id', authenticate, authorize('admin'), mongoIdParam(), validate, controller.remove);
  return router;
};

export const categoryRouter = crudRoutes(categoryController);
export const brandRouter = crudRoutes(brandController);
export const storeRouter = Router();
storeRouter.get('/integrations/providers/status', authenticate, authorize('admin', 'manager'), storeController.providerStatus);
storeRouter.get('/', paginationRules, validate, cacheResponse(300), storeController.list);
storeRouter.post('/', authenticate, authorize('admin', 'manager'), storeController.create);
storeRouter.get('/:id', mongoIdParam(), validate, storeController.get);
storeRouter.patch('/:id', authenticate, authorize('admin', 'manager'), mongoIdParam(), validate, storeController.update);
storeRouter.delete('/:id', authenticate, authorize('admin'), mongoIdParam(), validate, storeController.remove);
