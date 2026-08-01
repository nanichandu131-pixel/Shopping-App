import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['search', 'view_product', 'compare', 'buy_click', 'wishlist', 'price_alert'],
      required: true,
      index: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', index: true },
    query: { type: String, trim: true, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    revenue: { type: Number, min: 0, default: 0 },
    ipHash: String,
    userAgent: String,
    occurredAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

analyticsSchema.index({ eventType: 1, occurredAt: -1 });
analyticsSchema.index({ query: 'text' });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
