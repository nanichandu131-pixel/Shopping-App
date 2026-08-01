import { Router } from 'express';
import { body } from 'express-validator';
import { productController } from '../controllers/product.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware.js';
import { cacheResponse } from '../middleware/cache.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { mongoIdParam, productSearchRules } from '../validators/common.validators.js';

export const productRouter = Router();
export const comparisonRouter = Router();

productRouter.get('/', optionalAuth, productSearchRules, validate, cacheResponse(120), productController.search);
productRouter.post('/', authenticate, authorize('admin', 'manager'), productController.create);
productRouter.get('/deals', cacheResponse(120), productController.deals);
productRouter.get('/:id', optionalAuth, mongoIdParam(), validate, productController.getById);
productRouter.patch('/:id', authenticate, authorize('admin', 'manager'), mongoIdParam(), validate, productController.update);
productRouter.delete('/:id', authenticate, authorize('admin'), mongoIdParam(), validate, productController.remove);
productRouter.get('/:id/price-history', mongoIdParam(), validate, cacheResponse(300), productController.priceHistory);
productRouter.get('/:id/reviews', mongoIdParam(), validate, productController.reviews);
productRouter.get('/:id/similar', mongoIdParam(), validate, cacheResponse(300), productController.similar);
productRouter.post(
  '/:id/live-offers/sync',
  authenticate,
  authorize('admin', 'manager'),
  mongoIdParam(),
  body('providerKey').notEmpty(),
  body('storeProductId').notEmpty(),
  validate,
  productController.syncLiveOffer
);

comparisonRouter.get('/:id', optionalAuth, mongoIdParam(), validate, productController.compare);
