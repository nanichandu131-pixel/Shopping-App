import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    storeProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct', required: true, index: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    price: { amount: { type: Number, required: true, min: 0 }, currency: { type: String, default: 'INR' } },
    mrp: { amount: { type: Number, min: 0 }, currency: { type: String, default: 'INR' } },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    observedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

priceHistorySchema.index({ product: 1, store: 1, observedAt: -1 });

export const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
