import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class MyntraProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'myntra',
      name: 'Myntra',
      apiBaseUrl: process.env.MYNTRA_API_BASE_URL,
      apiKey: process.env.MYNTRA_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
