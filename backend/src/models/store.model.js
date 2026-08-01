import mongoose from 'mongoose';
import slugify from 'slugify';

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    providerKey: { type: String, required: true, unique: true },
    logoUrl: String,
    websiteUrl: { type: String, required: true },
    affiliateBaseUrl: String,
    isActive: { type: Boolean, default: true, index: true },
    isConfigured: { type: Boolean, default: false, index: true },
    priority: { type: Number, default: 100 },
    health: {
      status: { type: String, enum: ['unknown', 'healthy', 'degraded', 'down'], default: 'unknown' },
      lastCheckedAt: Date,
      message: String
    },
    integration: {
      mode: { type: String, enum: ['api', 'affiliate', 'scraper', 'disabled'], default: 'api' },
      apiBaseUrlEnv: String,
      apiKeyEnv: String
    }
  },
  { timestamps: true }
);

storeSchema.index({ isActive: 1, priority: 1 });
storeSchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export const Store = mongoose.model('Store', storeSchema);
