import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class TataCliqProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'tata-cliq',
      name: 'Tata Cliq',
      apiBaseUrl: process.env.TATA_CLIQ_API_BASE_URL,
      apiKey: process.env.TATA_CLIQ_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
