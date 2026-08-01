import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class MeeshoProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'meesho',
      name: 'Meesho',
      apiBaseUrl: process.env.MEESHO_API_BASE_URL,
      apiKey: process.env.MEESHO_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
