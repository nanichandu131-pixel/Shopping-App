export class StoreProvider {
  constructor({ key, name, apiBaseUrl, apiKey, timeoutMs }) {
    if (new.target === StoreProvider) {
      throw new Error('StoreProvider is an interface and cannot be instantiated directly');
    }
    this.key = key;
    this.name = name;
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  isConfigured() {
    return Boolean(this.apiBaseUrl && this.apiKey);
  }

  searchProducts() {
    throw new Error(`${this.name}.searchProducts() is not implemented`);
  }

  getProductDetails() {
    throw new Error(`${this.name}.getProductDetails() is not implemented`);
  }

  getPrice() {
    throw new Error(`${this.name}.getPrice() is not implemented`);
  }

  getAvailability() {
    throw new Error(`${this.name}.getAvailability() is not implemented`);
  }
}
