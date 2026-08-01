import { Analytics, Product, StoreProduct } from '../models/index.js';

class RecommendationService {
  async bestDeals(limit = 20) {
    return StoreProduct.find({
      availability: 'in_stock',
      'price.amount': { $gt: 0 },
      discountPercent: { $gt: 0 }
    })
      .populate('product store')
      .sort({ discountPercent: -1, 'price.amount': 1 })
      .limit(limit);
  }

  async similarProducts(productId, limit = 12) {
    const product = await Product.findById(productId);
    if (!product) return [];
    return Product.find({
      _id: { $ne: productId },
      status: 'active',
      $or: [{ category: product.category }, { brand: product.brand }, { tags: { $in: product.tags } }]
    })
      .populate('category brand')
      .limit(limit);
  }

  async trendingProducts(limit = 20) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const rows = await Analytics.aggregate([
      { $match: { eventType: { $in: ['view_product', 'compare', 'buy_click'] }, product: { $ne: null }, occurredAt: { $gte: since } } },
      { $group: { _id: '$product', score: { $sum: 1 } } },
      { $sort: { score: -1 } },
      { $limit: Number(limit) }
    ]);
    const ids = rows.map((row) => row._id);
    return Product.find({ _id: { $in: ids }, status: 'active' }).populate('category brand');
  }
}

export const recommendationService = new RecommendationService();
