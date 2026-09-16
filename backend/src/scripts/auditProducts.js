import { connectDatabase } from '../config/db.js';
import { Product, StoreProduct } from '../models/index.js';
import { getCategoryImage } from '../utils/categoryImages.js';
import { logger } from '../config/logger.js';

// Verifies every product has the required fields (name, category, image,
// brand, price, platform, rating). Missing images are auto-repaired from the
// reusable category -> image mapping and saved; every other gap is reported,
// since a category/brand/price/platform can't be safely invented.
await connectDatabase();

async function auditProducts() {
    const products = await Product.find({}).populate('category brand');
    const storeCounts = await StoreProduct.aggregate([{ $group: { _id: '$product', count: { $sum: 1 } } }]);
    const platformCountByProduct = new Map(storeCounts.map((row) => [row._id.toString(), row.count]));

    const issues = {
        missingName: [],
        missingCategory: [],
        missingImage: [],
        missingBrand: [],
        missingPrice: [],
        missingPlatform: [],
        missingRating: []
    };
    let imagesFixed = 0;

    for (const product of products) {
        const label = `${product.title || product._id}`;

        if (!product.title || !product.title.trim()) issues.missingName.push(label);
        if (!product.category) issues.missingCategory.push(label);
        if (!product.brand) issues.missingBrand.push(label);
        if (!product.basePrice || product.basePrice <= 0) issues.missingPrice.push(label);
        if (!platformCountByProduct.has(product._id.toString())) issues.missingPlatform.push(label);
        if (product.rating?.average === undefined || product.rating?.average === null) issues.missingRating.push(label);

        const hasImage = Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.url;
        if (!hasImage) {
            issues.missingImage.push(label);
            const url = getCategoryImage(product.category?.name, product.title);
            product.images = [{ url, alt: product.title || 'Product image', sortOrder: 0 }];
            await product.save();
            imagesFixed += 1;
        }
    }

    logger.info('Product audit complete', {
        totalProducts: products.length,
        imagesAutoFixed: imagesFixed,
        missingName: issues.missingName.length,
        missingCategory: issues.missingCategory.length,
        missingImage: issues.missingImage.length,
        missingBrand: issues.missingBrand.length,
        missingPrice: issues.missingPrice.length,
        missingPlatform: issues.missingPlatform.length,
        missingRating: issues.missingRating.length
    });

    for (const [field, list] of Object.entries(issues)) {
        if (list.length > 0 && field !== 'missingImage') {
            logger.warn(`Products missing ${field}`, { count: list.length, examples: list.slice(0, 10) });
        }
    }

    return issues;
}

auditProducts()
    .then(() => process.exit(0))
    .catch((err) => {
        logger.error('Product audit failed', { error: err.message, stack: err.stack });
        process.exit(1);
    });
