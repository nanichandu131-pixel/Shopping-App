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
    return this.list(filter, queryParams, ['category', 'brand']);
  }

  getStoreOffers(productId) {
    return StoreProduct.find({ product: productId })
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
