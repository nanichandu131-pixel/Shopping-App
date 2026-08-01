import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, maxlength: 500 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    imageUrl: String,
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ parent: 1, isActive: 1 });

categorySchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.name) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export const Category = mongoose.model('Category', categorySchema);
