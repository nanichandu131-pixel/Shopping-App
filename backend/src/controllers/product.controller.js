import { Category, PriceHistory, Product, Review } from '../models/index.js';
import { productRepository } from '../repositories/product.repository.js';
import { productService } from '../services/product.service.js';
import { recommendationService } from '../services/recommendation.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { delCachePattern } from '../utils/cache.js';
import { getCategoryImage } from '../utils/categoryImages.js';

// A product created without its own image gets one auto-assigned from its
// category's verified image pool, so the catalog never shows a broken image
// or an image unrelated to the product (e.g. a mobile phone never gets a
// clothing photo). Falls back to the title alone if no category is set yet.
const withCategoryImageFallback = async (body) => {
  if (Array.isArray(body.images) && body.images.length > 0) return body;
  let categoryName = null;
  if (body.category) {
    const category = await Category.findById(body.category).select('name').lean();
    categoryName = category?.name || null;
  }
  const url = getCategoryImage(categoryName, body.title || categoryName);
  return { ...body, images: [{ url, alt: body.title || 'Product image', sortOrder: 0 }] };
};

export const productController = {
  search: asyncHandler(async (req, res) => {
    const data = await productService.search(req.query, req.user);
    res.json(data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await withCategoryImageFallback(req.body);
    const product = await Product.create(data);
    await delCachePattern('http:/api/products*');
    res.status(201).json({ product });
  }),
  deals: asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit || 24), 100);
    const items = await recommendationService.bestDeals(limit);
    res.json({ items });
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await productService.getProduct(req.params.id, req.user);
    res.json(data);
  }),
  update: asyncHandler(async (req, res) => {
    const product = await productRepository.updateById(req.params.id, req.body);
    if (!product) throw new AppError('Product not found', 404);
    await delCachePattern('http:/api/products*');
    await delCachePattern(`http:/api/comparisons/${req.params.id}*`);
    res.json({ product });
  }),
  remove: asyncHandler(async (req, res) => {
    const product = await productRepository.deleteById(req.params.id);
    if (!product) throw new AppError('Product not found', 404);
    await delCachePattern('http:/api/products*');
    res.status(204).send();
  }),
  compare: asyncHandler(async (req, res) => {
    const comparison = await productService.compare(req.params.id, req.user);
    res.json(comparison);
  }),
  priceHistory: asyncHandler(async (req, res) => {
    const history = await PriceHistory.find({ product: req.params.id }).populate('store').sort({ observedAt: 1 });
    res.json({ history });
  }),
  reviews: asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id, status: 'approved' })
      .populate('user', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  }),
  similar: asyncHandler(async (req, res) => {
    const products = await recommendationService.similarProducts(req.params.id);
    res.json({ products });
  }),
  syncLiveOffer: asyncHandler(async (req, res) => {
    const offer = await productService.syncLiveOffer(
      req.body.providerKey,
      req.body.storeProductId,
      req.params.id
    );
    await delCachePattern('http:/api/products*');
    await delCachePattern(`http:/api/comparisons/${req.params.id}*`);
    res.json({ offer });
  })
};
