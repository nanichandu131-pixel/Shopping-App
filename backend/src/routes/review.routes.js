import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { reviewRules } from '../validators/common.validators.js';

export const reviewRouter = Router();

reviewRouter.use(authenticate);
reviewRouter.get('/me', reviewController.myReviews);
reviewRouter.post('/', reviewRules, validate, reviewController.create);
