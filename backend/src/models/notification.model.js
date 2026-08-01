import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['price_drop', 'alert', 'recommendation', 'system'],
      required: true,
      index: true
    },
    title: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 1000 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    readAt: Date
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
