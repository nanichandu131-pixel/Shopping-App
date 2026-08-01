import { body, param, query } from 'express-validator';

export const mongoIdParam = (name = 'id') => [param(name).isMongoId()];

export const paginationRules = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isString()
];

export const productSearchRules = [
    query('q').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 120 }),
    query('category').optional().isMongoId(),
    query('brand').optional().isMongoId(),
    query('minRating').optional().isFloat({ min: 1, max: 5 }),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    ...paginationRules
];

export const productCreateRules = [
    body('title').trim().isLength({ min: 2, max: 240 }),
    body('description').optional().trim().isLength({ max: 5000 }),
    body('category').optional().isMongoId(),
    body('brand').optional().isMongoId(),
    body('modelNumber').optional().trim().isLength({ max: 120 }),
    body('basePrice').optional().isFloat({ min: 0 }),
    body('baseMrp').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['draft', 'active', 'archived'])
];

export const reviewRules = [
    body('product').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 120 }),
    body('body').optional().trim().isLength({ max: 2000 })
];

export const alertRules = [
    body('product').isMongoId(),
    body('targetPrice.amount').isFloat({ min: 0 }),
    body('targetPrice.currency').optional().isString().isLength({ min: 3, max: 3 }),
    body('channel').optional().isIn(['email', 'notification', 'both'])
];