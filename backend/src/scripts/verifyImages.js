import { connectDatabase } from '../config/db.js';
import { Category, Product } from '../models/index.js';
import { logger } from '../config/logger.js';

// Verifies every product and category image: no local/placeholder scheme,
// no duplicates within a category, and every URL actually resolves (HTTP 200).
await connectDatabase();

const isPlaceholder = (url) => !url || url.startsWith('data:') || url.includes('picsum.photos');

async function checkUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.status === 200) return true;
        const res2 = await fetch(url, { method: 'GET' });
        return res2.status === 200;
    } catch {
        return false;
    }
}

async function verify() {
    const products = await Product.find({}).populate('category');
    const categories = await Category.find({});

    const brokenProducts = [];
    const placeholderProducts = [];
    const brokenCategories = [];
    const placeholderCategories = [];
    const dupesByCategory = new Map();

    for (const p of products) {
        const url = p.images?.[0]?.url;
        if (isPlaceholder(url)) {
            placeholderProducts.push(p.title);
            continue;
        }
        const ok = await checkUrl(url);
        if (!ok) brokenProducts.push({ title: p.title, url });

        const catName = p.category?.name || 'Uncategorized';
        if (!dupesByCategory.has(catName)) dupesByCategory.set(catName, new Map());
        const seen = dupesByCategory.get(catName);
        seen.set(url, (seen.get(url) || 0) + 1);
    }

    for (const c of categories) {
        if (isPlaceholder(c.imageUrl)) {
            placeholderCategories.push(c.name);
            continue;
        }
        const ok = await checkUrl(c.imageUrl);
        if (!ok) brokenCategories.push({ name: c.name, url: c.imageUrl });
    }

    const duplicates = [];
    for (const [cat, urlMap] of dupesByCategory) {
        for (const [url, count] of urlMap) {
            if (count > 1) duplicates.push({ category: cat, url, count });
        }
    }

    logger.info('Image verification complete', {
        totalProducts: products.length,
        totalCategories: categories.length,
        brokenProducts: brokenProducts.length,
        placeholderProducts: placeholderProducts.length,
        brokenCategories: brokenCategories.length,
        placeholderCategories: placeholderCategories.length,
        duplicateImagesWithinCategory: duplicates.length
    });

    if (brokenProducts.length) logger.error('BROKEN product images', { items: brokenProducts });
    if (placeholderProducts.length) logger.error('PLACEHOLDER product images', { items: placeholderProducts });
    if (brokenCategories.length) logger.error('BROKEN category images', { items: brokenCategories });
    if (placeholderCategories.length) logger.warn('Categories using generic default image (no dedicated pool)', { items: placeholderCategories });
    if (duplicates.length) logger.error('DUPLICATE images within same category', { items: duplicates });

    const pass = brokenProducts.length === 0 && placeholderProducts.length === 0 &&
        brokenCategories.length === 0 && duplicates.length === 0;
    logger.info(pass ? 'ALL CHECKS PASSED' : 'CHECKS FAILED');
    return pass;
}

verify()
    .then((pass) => process.exit(pass ? 0 : 1))
    .catch((err) => {
        logger.error('Verification script crashed', { error: err.message, stack: err.stack });
        process.exit(1);
    });
