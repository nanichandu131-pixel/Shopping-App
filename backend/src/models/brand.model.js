import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    slug: { type: String, unique: true, index: true },
    logoUrl: String,
    website: String,
    description: { type: String, maxlength: 1000 },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

brandSchema.index({ name: 'text', description: 'text' });
brandSchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export const Brand = mongoose.model('Brand', brandSchema);
