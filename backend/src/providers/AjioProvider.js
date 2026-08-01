import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class AjioProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'ajio',
      name: 'Ajio',
      apiBaseUrl: process.env.AJIO_API_BASE_URL,
      apiKey: process.env.AJIO_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
