import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class FlipkartProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'flipkart',
      name: 'Flipkart',
      apiBaseUrl: process.env.FLIPKART_API_BASE_URL,
      apiKey: process.env.FLIPKART_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
