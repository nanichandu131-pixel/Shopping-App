import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120 },
    body: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
