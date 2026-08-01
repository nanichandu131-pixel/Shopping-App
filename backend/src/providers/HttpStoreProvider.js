import axios from 'axios';
import { StoreProvider } from './StoreProvider.js';
import { AppError } from '../utils/AppError.js';

export class HttpStoreProvider extends StoreProvider {
  client() {
    if (!this.isConfigured()) {
      throw new AppError(`${this.name} integration is not configured`, 503, {
        provider: this.key
      });
    }

    return axios.create({
      baseURL: this.apiBaseUrl,
      timeout: this.timeoutMs,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'X-SmartPrice-Provider': this.key
      }
    });
  }

  normalizeProduct(item) {
    return {
      provider: this.key,
      store: this.name,
      storeProductId: item.id || item.sku || item.productId,
      title: item.title || item.name,
      url: item.url || item.productUrl,
      imageUrl: item.imageUrl || item.image,
      price: item.price,
      mrp: item.mrp,
      discountPercent: item.discountPercent,
      availability: item.availability || 'unknown',
      rating: item.rating,
      raw: item
    };
  }

  async searchProducts({ query, page = 1, limit = 20, filters = {} }) {
    const { data } = await this.client().get('/products/search', {
      params: { q: query, page, limit, ...filters }
    });
    const items = Array.isArray(data.items) ? data.items : data.products || [];
    return items.map((item) => this.normalizeProduct(item));
  }

  async getProductDetails(storeProductId) {
    const { data } = await this.client().get(`/products/${encodeURIComponent(storeProductId)}`);
    return this.normalizeProduct(data);
  }

  async getPrice(storeProductId) {
    const { data } = await this.client().get(`/products/${encodeURIComponent(storeProductId)}/price`);
    return data.price;
  }

  async getAvailability(storeProductId) {
    const { data } = await this.client().get(
      `/products/${encodeURIComponent(storeProductId)}/availability`
    );
    return data.availability || 'unknown';
  }
}
