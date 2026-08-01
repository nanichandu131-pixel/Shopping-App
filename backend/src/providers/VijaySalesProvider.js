import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class VijaySalesProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'vijay-sales',
      name: 'Vijay Sales',
      apiBaseUrl: process.env.VIJAY_SALES_API_BASE_URL,
      apiKey: process.env.VIJAY_SALES_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
