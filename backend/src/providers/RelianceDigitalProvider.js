import { HttpStoreProvider } from './HttpStoreProvider.js';
import { env } from '../config/env.js';

export class RelianceDigitalProvider extends HttpStoreProvider {
  constructor() {
    super({
      key: 'reliance-digital',
      name: 'Reliance Digital',
      apiBaseUrl: process.env.RELIANCE_DIGITAL_API_BASE_URL,
      apiKey: process.env.RELIANCE_DIGITAL_API_KEY,
      timeoutMs: env.storeTimeoutMs
    });
  }
}
