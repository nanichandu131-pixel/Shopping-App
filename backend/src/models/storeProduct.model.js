import mongoose from 'mongoose';

const moneySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' }
  },
  { _id: false }
);

const storeProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    storeProductId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    imageUrl: String,
    price: moneySchema,
    mrp: moneySchema,
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    deliveryCharge: moneySchema,
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'limited', 'preorder', 'unknown'],
      default: 'unknown',
      index: true
    },
    rating: {
      average: { type: Number, min: 0, max: 5 },
      count: { type: Number, min: 0 }
    },
    seller: {
      name: String,
      rating: Number
    },
    lastSyncedAt: { type: Date, index: true },
    raw: { type: mongoose.Schema.Types.Mixed, select: false }
  },
  { timestamps: true }
);

storeProductSchema.index({ store: 1, storeProductId: 1 }, { unique: true });
storeProductSchema.index({ product: 1, 'price.amount': 1 });
storeProductSchema.index({ title: 'text' });

export const StoreProduct = mongoose.model('StoreProduct', storeProductSchema);
