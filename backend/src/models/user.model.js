import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const refreshSessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, index: true },
    userAgent: String,
    ip: String,
    expiresAt: { type: Date, required: true },
    revokedAt: Date
  },
  { _id: false, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
      index: true
    },
    avatarUrl: String,
    phone: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    tokenVersion: { type: Number, default: 0 },
    refreshSessions: [refreshSessionSchema],
    preferences: {
      currency: { type: String, default: 'INR' },
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notifications: {
        priceAlerts: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
      }
    },
    lastLoginAt: Date,
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
      index: true
    }
  },
  { timestamps: true }
);

userSchema.index({ name: 'text', email: 'text' });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.refreshSessions;
  return user;
};

export const User = mongoose.model('User', userSchema);
