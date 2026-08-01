import {
  Notification,
  PriceAlert,
  Product,
  RecentlyViewed,
  SavedSearch,
  User,
  Wishlist,
  Analytics
} from '../models/index.js';
import { notificationService } from '../services/notification.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const userController = {
  profile: asyncHandler(async (req, res) => res.json({ user: req.user })),
  updateProfile: asyncHandler(async (req, res) => {
    const allowed = ['name', 'avatarUrl', 'phone', 'preferences'];
    const patch = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true, runValidators: true });
    res.json({ user });
  }),
  wishlist: asyncHandler(async (req, res) => {
    const items = await Wishlist.find({ user: req.user.id }).populate('product').sort({ createdAt: -1 });
    res.json({ items });
  }),
  addWishlist: asyncHandler(async (req, res) => {
    const exists = await Wishlist.exists({ user: req.user.id, product: req.body.product });
    const item = await Wishlist.findOneAndUpdate(
      { user: req.user.id, product: req.body.product },
      { notes: req.body.notes },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('product');
    if (!exists) Product.updateOne({ _id: req.body.product }, { $inc: { 'stats.wishlistCount': 1 } }).catch(() => {});
    Analytics.create({ eventType: 'wishlist', user: req.user.id, product: req.body.product }).catch(() => {});
    res.status(201).json({ item });
  }),
  removeWishlist: asyncHandler(async (req, res) => {
    await Wishlist.deleteOne({ user: req.user.id, product: req.params.productId });
    Product.updateOne({ _id: req.params.productId, 'stats.wishlistCount': { $gt: 0 } }, { $inc: { 'stats.wishlistCount': -1 } }).catch(() => {});
    res.status(204).send();
  }),
  savedSearches: asyncHandler(async (req, res) => {
    const items = await SavedSearch.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  }),
  saveSearch: asyncHandler(async (req, res) => {
    const item = await SavedSearch.findOneAndUpdate(
      { user: req.user.id, query: req.body.query },
      { filters: req.body.filters || {}, notifyOnNewDeals: req.body.notifyOnNewDeals || false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ item });
  }),
  deleteSavedSearch: asyncHandler(async (req, res) => {
    await SavedSearch.deleteOne({ user: req.user.id, _id: req.params.id });
    res.status(204).send();
  }),
  alerts: asyncHandler(async (req, res) => {
    const items = await PriceAlert.find({ user: req.user.id }).populate('product').sort({ createdAt: -1 });
    res.json({ items });
  }),
  createAlert: asyncHandler(async (req, res) => {
    const item = await PriceAlert.create({ ...req.body, user: req.user.id });
    res.status(201).json({ item });
  }),
  updateAlert: asyncHandler(async (req, res) => {
    const item = await PriceAlert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) throw new AppError('Alert not found', 404);
    res.json({ item });
  }),
  deleteAlert: asyncHandler(async (req, res) => {
    await PriceAlert.deleteOne({ _id: req.params.id, user: req.user.id });
    res.status(204).send();
  }),
  notifications: asyncHandler(async (req, res) => {
    const items = await notificationService.list(req.user.id, req.query);
    res.json({ items });
  }),
  markNotificationRead: asyncHandler(async (req, res) => {
    const item = await notificationService.markRead(req.user.id, req.params.id);
    if (!item) throw new AppError('Notification not found', 404);
    res.json({ item });
  }),
  recentlyViewed: asyncHandler(async (req, res) => {
    const items = await RecentlyViewed.find({ user: req.user.id })
      .populate('product')
      .sort({ viewedAt: -1 })
      .limit(30);
    res.json({ items });
  }),
  unreadCount: asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ user: req.user.id, readAt: null });
    res.json({ count });
  })
};
