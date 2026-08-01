import { Analytics, PriceHistory, Product, RecentlyViewed, Store, StoreProduct } from '../models/index.js';
import { productRepository } from '../repositories/product.repository.js';
import { providerRegistry } from '../providers/providerRegistry.js';
import { AppError } from '../utils/AppError.js';
import { getCache, setCache } from '../utils/cache.js';

const moneyAmount = (value) => {
  if (typeof value === 'number') return { amount: value, currency: 'INR' };
  if (value?.amount !== undefined) return { amount: Number(value.amount), currency: value.currency || 'INR' };
  return undefined;
};

class ProductService {
  async search(queryParams, user) {
    const q = queryParams.q?.trim();
    const localResults = await productRepository.search(queryParams);

    if (q) {
      Analytics.create({ eventType: 'search', query: q, user: user?.id }).catch(() => {});
    }

    if (!q) return localResults;

    const cacheKey = `provider-search:${q}:${queryParams.page || 1}:${queryParams.limit || 20}`;
    const cachedProviderResults = await getCache(cacheKey);
    if (cachedProviderResults) return { ...localResults, providerResults: cachedProviderResults };

    const configured = providerRegistry.configured();
    const providerResults = await Promise.allSettled(
      configured.map((provider) =>
        provider.searchProducts({
          query: q,
          page: queryParams.page || 1,
          limit: queryParams.limit || 20,
          filters: queryParams
        })
      )
    );

    const liveResults = providerResults.flatMap((result, index) =>
      result.status === 'fulfilled'
        ? result.value
        : [{ provider: configured[index].key, store: configured[index].name, error: result.reason.message }]
    );

    await setCache(cacheKey, liveResults, 180);
    return { ...localResults, providerResults: liveResults };
  }

  async getProduct(id, user) {
    const product = await productRepository.findById(id, ['category', 'brand']);
    if (!product) throw new AppError('Product not found', 404);

    Product.updateOne({ _id: id }, { $inc: { 'stats.viewCount': 1 } }).catch(() => {});
    if (user) {
      RecentlyViewed.findOneAndUpdate(
        { user: user.id, product: id },
        { viewedAt: new Date() },
        { upsert: true, setDefaultsOnInsert: true }
      ).catch(() => {});
      Analytics.create({ eventType: 'view_product', user: user.id, product: id }).catch(() => {});
    }

    const [offers, priceHistory] = await Promise.all([
      productRepository.getStoreOffers(id),
      productRepository.getPriceHistory(id)
    ]);
    return { product, offers, priceHistory };
  }

  async compare(productId, user) {
    const offers = await productRepository.getStoreOffers(productId);
    const priced = offers.filter((offer) => offer.price?.amount !== undefined);
    const lowest = priced[0] || null;
    const highest = priced[priced.length - 1] || null;
    Product.updateOne({ _id: productId }, { $inc: { 'stats.compareCount': 1 } }).catch(() => {});
    if (user) Analytics.create({ eventType: 'compare', user: user.id, product: productId }).catch(() => {});
    return {
      offers,
      lowest,
      highest,
      priceDifference:
        lowest && highest ? Math.max(highest.price.amount - lowest.price.amount, 0) : null
    };
  }

  async syncLiveOffer(providerKey, storeProductId, productId) {
    const provider = providerRegistry.get(providerKey);
    if (!provider) throw new AppError('Unknown provider', 404);
    const live = await provider.getProductDetails(storeProductId);
    const store = await Store.findOne({ providerKey });
    if (!store) throw new AppError('Store is not registered', 404);

    const offer = await StoreProduct.findOneAndUpdate(
      { store: store.id, storeProductId },
      {
        product: productId,
        store: store.id,
        storeProductId,
        title: live.title,
        url: live.url,
        imageUrl: live.imageUrl,
        price: moneyAmount(live.price),
        mrp: moneyAmount(live.mrp),
        discountPercent: live.discountPercent || 0,
        availability: live.availability,
        lastSyncedAt: new Date(),
        raw: live.raw
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (offer.price?.amount !== undefined) {
      await PriceHistory.create({
        product: productId,
        storeProduct: offer.id,
        store: store.id,
        price: offer.price,
        mrp: offer.mrp,
        discountPercent: offer.discountPercent
      });
    }

    return offer;
  }
}

export const productService = new ProductService();
