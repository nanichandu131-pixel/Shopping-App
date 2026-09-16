import { Product, StoreProduct, PriceHistory } from '../models/index.js';
import { BaseRepository } from './base.repository.js';
import { buildTextFilter } from '../utils/apiFeatures.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  search(queryParams) {
    const filter = {
      status: 'active',
      ...buildTextFilter(queryParams, ['title', 'description', 'tags', 'searchKeywords'])
    };

    if (queryParams.category) filter.category = queryParams.category;
    if (queryParams.brand) filter.brand = queryParams.brand;
    if (queryParams.minRating) filter['rating.average'] = { $gte: Number(queryParams.minRating) };
    if (queryParams.minPrice || queryParams.maxPrice) {
      filter.basePrice = {};
      if (queryParams.minPrice) filter.basePrice.$gte = Number(queryParams.minPrice);
      if (queryParams.maxPrice) filter.basePrice.$lte = Number(queryParams.maxPrice);
    }
    return this.list(filter, queryParams, ['category', 'brand']);
  }

  getStoreOffers(productId) {
    // Only ever return offers that are actually available and complete —
    // an out-of-stock listing isn't a store the product is really "in",
    // and an offer missing its price/url/image isn't safe to render.
    return StoreProduct.find({
      product: productId,
      availability: { $ne: 'out_of_stock' },
      url: { $exists: true, $ne: '' },
      'price.amount': { $exists: true, $gt: 0 },
      imageUrl: { $exists: true, $ne: '' }
    })
      .populate('store')
      .sort({ 'price.amount': 1, availability: 1 });
  }

  getPriceHistory(productId, days = 90) {
    const from = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);
    return PriceHistory.find({ product: productId, observedAt: { $gte: from } })
      .populate('store')
      .sort({ observedAt: 1 });
  }
}

export const productRepository = new ProductRepository();
