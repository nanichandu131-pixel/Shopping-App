import { Router } from 'express';
import { adminRouter, analyticsRouter } from './analytics.routes.js';
import { authRouter } from './auth.routes.js';
import { brandRouter, categoryRouter, storeRouter } from './catalog.routes.js';
import { comparisonRouter, productRouter } from './product.routes.js';
import { reviewRouter } from './review.routes.js';
import { alertRouter, userRouter, wishlistRouter } from './user.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/brands', brandRouter);
apiRouter.use('/stores', storeRouter);
apiRouter.use('/comparisons', comparisonRouter);
apiRouter.use('/wishlist', wishlistRouter);
apiRouter.use('/alerts', alertRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/admin', adminRouter);
