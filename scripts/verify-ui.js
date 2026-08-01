import { chromium } from 'playwright-chromium';

async function run() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
        const base = process.env.TEST_URL || 'http://localhost:5173';
        const apiBase = process.env.API_URL || 'http://localhost:5000';
        const searchUrl = `${base.replace(/\/$/, '')}/search`;

        // Query backend for a product that has price history
        let targetId = null;
        try {
            const productsResp = await fetch(`${apiBase.replace(/\/$/, '')}/api/products?limit=100`);
            if (productsResp.ok) {
                const productsJson = await productsResp.json();
                const items = productsJson.items || [];
                for (const p of items) {
                    try {
                        const hist = await fetch(`${apiBase.replace(/\/$/, '')}/api/products/${p._id}/price-history`);
                        if (hist.ok) {
                            const j = await hist.json();
                            if (Array.isArray(j.history) && j.history.length > 0) {
                                targetId = p._id;
                                break;
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        } catch (e) {
            // ignore and fall back to UI selection
        }

        console.log('Opening', searchUrl);
        await page.goto(searchUrl, { waitUntil: 'networkidle' });
        if (targetId) {
            const prodUrl = `${base.replace(/\/$/, '')}/products/${targetId}`;
            console.log('Navigating directly to product with price history:', prodUrl);
            await page.goto(prodUrl, { waitUntil: 'networkidle' });
        }

        if (!targetId) {
            // Wait for ProductCard articles to appear
            await page.waitForSelector('article', { timeout: 15000 });
            const items = await page.locator('article').elementHandles();
            console.log('Found', items.length, 'article elements');
            if (items.length === 0) {
                console.error('No product cards found — UI may not be rendering seeded products');
                process.exit(2);
            }

            // try to click a visible product that has history
            const links = await page.locator('article a').elementHandles();
            let clicked = false;
            for (const handle of links) {
                const href = await handle.getAttribute('href');
                if (!href) continue;
                const m = href.match(/\/products\/(.+)$/);
                if (!m) continue;
                const id = m[1];
                try {
                    const resp = await fetch(`${apiBase.replace(/\/$/, '')}/api/products/${id}/price-history`);
                    if (resp.ok) {
                        const json = await resp.json();
                        if (Array.isArray(json.history) && json.history.length > 0) {
                            await handle.click();
                            clicked = true;
                            break;
                        }
                    }
                } catch (e) {
                    // ignore and try next
                }
            }
            if (!clicked) await page.locator('article a').first().click();
        }

        await page.waitForURL('**/products/*', { timeout: 15000 });
        await page.waitForFunction(
            () => {
                const heading = document.querySelector('main h1');
                return heading && heading.innerText !== 'Search Results';
            }, { timeout: 15000 }
        );

        const title = await page.locator('main h1').first().textContent();
        const hasChart = await page.locator('[aria-label="Price history chart"]').count();
        // use explicit trim to avoid optional-chaining or hidden-char parse issues
        console.log('Product details title:', title && title.trim());
        console.log('Product details URL:', page.url());
        console.log('Price history chart present:', hasChart > 0);

        await browser.close();
        process.exit(0);
    } catch (err) {
        console.error('UI verification failed:', err);
        await browser.close();
        process.exit(1);
    }
}

run();