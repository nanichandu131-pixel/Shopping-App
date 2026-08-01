import mongoose from 'mongoose';
import slugify from 'slugify';

const specificationSchema = new mongoose.Schema({
    group: { type: String, default: 'General' },
    name: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 240 },
    slug: { type: String, unique: true, index: true },
    normalizedTitle: { type: String, index: true },
    description: { type: String, maxlength: 5000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
    modelNumber: { type: String, trim: true, index: true },
    images: [{ url: String, alt: String, sortOrder: Number }],
    specifications: [specificationSchema],
    basePrice: { type: Number, default: 0, min: 0 },
    baseMrp: { type: Number, default: 0, min: 0 },
    rating: {
        average: { type: Number, min: 0, max: 5, default: 0 },
        count: { type: Number, min: 0, default: 0 }
    },
    tags: [{ type: String, index: true }],
    searchKeywords: [{ type: String, index: true }],
    status: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'active',
        index: true
    },
    seo: {
        title: String,
        description: String,
        canonicalUrl: String
    },
    stats: {
        viewCount: { type: Number, default: 0 },
        compareCount: { type: Number, default: 0 },
        wishlistCount: { type: Number, default: 0 }
    }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', tags: 'text', searchKeywords: 'text' });
productSchema.index({ category: 1, brand: 1, status: 1 });

productSchema.pre('validate', function setDerivedFields(next) {
    if (!this.slug && this.title) this.slug = slugify(this.title, { lower: true, strict: true });
    if (this.title) this.normalizedTitle = this.title.toLowerCase().replace(/\s+/g, ' ').trim();
    next();
});

export const Product = mongoose.model('Product', productSchema);