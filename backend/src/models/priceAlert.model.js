import mongoose from 'mongoose';

const priceAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    targetPrice: { amount: { type: Number, required: true, min: 0 }, currency: { type: String, default: 'INR' } },
    channel: { type: String, enum: ['email', 'notification', 'both'], default: 'both' },
    isActive: { type: Boolean, default: true, index: true },
    lastTriggeredAt: Date
  },
  { timestamps: true }
);

priceAlertSchema.index({ user: 1, product: 1, isActive: 1 });

export const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);
