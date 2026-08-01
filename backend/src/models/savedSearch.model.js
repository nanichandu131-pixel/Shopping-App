import mongoose from 'mongoose';

const savedSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    query: { type: String, required: true, trim: true },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    notifyOnNewDeals: { type: Boolean, default: false }
  },
  { timestamps: true }
);

savedSearchSchema.index({ user: 1, query: 1 }, { unique: true });
savedSearchSchema.index({ query: 'text' });

export const SavedSearch = mongoose.model('SavedSearch', savedSearchSchema);
