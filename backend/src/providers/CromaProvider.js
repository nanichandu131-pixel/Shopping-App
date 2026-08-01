import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class CromaProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'croma',
      name: 'Croma',
      apiBaseUrl: process.env.CROMA_API_BASE_URL,
      apiKey: process.env.CROMA_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
