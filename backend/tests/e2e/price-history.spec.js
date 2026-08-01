const { test, expect } = require('@playwright/test');

// Simple smoke test: navigate to a product with price history and assert chart presence
test('product details shows price history chart', async({ page, request }) => {
    const API_URL = process.env.API_URL || 'http://localhost:5000';
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    // find a product with price history
    const productsRes = await request.get(`${API_URL}/api/products?limit=100`);
    expect(productsRes.ok()).toBeTruthy();
    const productsJson = await productsRes.json();
    const product = productsJson.find(p => p.priceHistoryCount && p.priceHistoryCount > 0) || productsJson[0];
    expect(product).toBeTruthy();

    await page.goto(`${FRONTEND_URL}/products/${product._id}`);
    await page.waitForSelector('h1');
    const heading = await page.textContent('h1');
    expect(heading.toLowerCase()).toContain((product.title || product.name || '').toLowerCase());

    // chart container
    const chart = await page.$('[aria-label="Price history chart"]');
    expect(chart).not.toBeNull();
});