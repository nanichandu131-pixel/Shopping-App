const { chromium } = require('playwright-chromium');

(async function run() {
    const API_URL = process.env.API_URL || 'http://localhost:5000';
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
        // find a product with price history
        let targetId = null;
        try {
            const productsRes = await fetch(`${API_URL}/api/products?limit=100`);
            if (productsRes.ok) {
                const productsJson = await productsRes.json();
                const items = productsJson.items || productsJson || [];
                for (const p of items) {
                    try {
                        const hist = await fetch(`${API_URL}/api/products/${p._id}/price-history`);
                        if (hist.ok) {
                            const j = await hist.json();
                            if (Array.isArray(j.history) && j.history.length > 0) {
                                targetId = p._id;
                                break;
                            }
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}

        if (targetId) {
            const prodUrl = `${FRONTEND_URL.replace(/\/$/, '')}/products/${targetId}`;
            console.log('Navigating directly to product with price history:', prodUrl);
            await page.goto(prodUrl, { waitUntil: 'networkidle' });
        } else {
            const searchUrl = `${FRONTEND_URL.replace(/\/$/, '')}/search`;
            console.log('Opening', searchUrl);
            await page.goto(searchUrl, { waitUntil: 'networkidle' });
            await page.waitForSelector('article', { timeout: 15000 });
            const links = await page.locator('article a').elementHandles();
            let clicked = false;
            for (const handle of links) {
                const href = await handle.getAttribute('href');
                if (!href) continue;
                const m = href.match(/\/products\/(.+)$/);
                if (!m) continue;
                const id = m[1];
                try {
                    const resp = await fetch(`${API_URL.replace(/\/$/, '')}/api/products/${id}/price-history`);
                    if (resp.ok) {
                        const json = await resp.json();
                        if (Array.isArray(json.history) && json.history.length > 0) {
                            await handle.click();
                            clicked = true;
                            break;
                        }
                    }
                } catch (e) {}
            }
            if (!clicked) await page.locator('article a').first().click();
        }

        await page.waitForURL('**/products/*', { timeout: 15000 });
        await page.waitForFunction(() => {
            const heading = document.querySelector('main h1');
            return heading && heading.innerText !== 'Search Results';
        }, { timeout: 15000 });

        const title = await page.locator('main h1').first().textContent();
        const hasChart = await page.locator('[aria-label="Price history chart"]').count();
        console.log('Product details title:', title && title.trim());
        console.log('Product details URL:', page.url());
        console.log('Price history chart present:', hasChart > 0);

        await browser.close();
        process.exit(hasChart > 0 ? 0 : 2);
    } catch (err) {
        console.error('E2E failed:', err);
        await browser.close();
        process.exit(1);
    }
})();