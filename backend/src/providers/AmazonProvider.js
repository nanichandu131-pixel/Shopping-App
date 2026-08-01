import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class AmazonProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'amazon',
      name: 'Amazon',
      apiBaseUrl: process.env.AMAZON_API_BASE_URL,
      apiKey: process.env.AMAZON_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
