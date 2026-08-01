import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { alertRules, mongoIdParam } from '../validators/common.validators.js';

export const userRouter = Router();
export const wishlistRouter = Router();
export const alertRouter = Router();

userRouter.use(authenticate);
userRouter.get('/me', userController.profile);
userRouter.patch('/me', userController.updateProfile);
userRouter.get('/saved-searches', userController.savedSearches);
userRouter.post('/saved-searches', body('query').trim().isLength({ min: 2, max: 120 }), validate, userController.saveSearch);
userRouter.delete('/saved-searches/:id', mongoIdParam(), validate, userController.deleteSavedSearch);
userRouter.get('/recently-viewed', userController.recentlyViewed);
userRouter.get('/notifications', userController.notifications);
userRouter.get('/notifications/unread-count', userController.unreadCount);
userRouter.patch('/notifications/:id/read', mongoIdParam(), validate, userController.markNotificationRead);

wishlistRouter.use(authenticate);
wishlistRouter.get('/', userController.wishlist);
wishlistRouter.post('/', body('product').isMongoId(), validate, userController.addWishlist);
wishlistRouter.delete('/:productId', mongoIdParam('productId'), validate, userController.removeWishlist);

alertRouter.use(authenticate);
alertRouter.get('/', userController.alerts);
alertRouter.post('/', alertRules, validate, userController.createAlert);
alertRouter.patch('/:id', mongoIdParam(), validate, userController.updateAlert);
alertRouter.delete('/:id', mongoIdParam(), validate, userController.deleteAlert);
