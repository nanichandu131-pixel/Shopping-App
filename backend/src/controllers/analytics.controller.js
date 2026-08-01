import { Analytics, PriceAlert, Product, StoreProduct, User } from '../models/index.js';
import { recommendationService } from '../services/recommendation.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const analyticsController = {
  dashboard: asyncHandler(async (_req, res) => {
    const [users, products, offers, alerts, bestDeals, trending] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'active' }),
      StoreProduct.countDocuments(),
      PriceAlert.countDocuments({ isActive: true }),
      recommendationService.bestDeals(8),
      recommendationService.trendingProducts(8)
    ]);
    res.json({ users, products, offers, alerts, bestDeals, trending });
  }),
  searchAnalytics: asyncHandler(async (_req, res) => {
    const rows = await Analytics.aggregate([
      { $match: { eventType: 'search', query: { $ne: null } } },
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);
    res.json({ searches: rows.map((row) => ({ query: row._id, count: row.count })) });
  }),
  revenueAnalytics: asyncHandler(async (_req, res) => {
    const rows = await Analytics.aggregate([
      { $match: { eventType: 'buy_click' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$occurredAt' } }, revenue: { $sum: '$revenue' }, clicks: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ revenue: rows });
  }),
  users: asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const filter = req.query.q
      ? { $or: [{ name: { $regex: req.query.q, $options: 'i' } }, { email: { $regex: req.query.q, $options: 'i' } }] }
      : {};
    const [items, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter)
    ]);
    res.json({ items, meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  }),
  updateUser: asyncHandler(async (req, res) => {
    const patch = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => ['role', 'status', 'name', 'isEmailVerified'].includes(key))
    );
    const user = await User.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found', 404);
    res.json({ user });
  }),
  track: asyncHandler(async (req, res) => {
    await Analytics.create({
      ...req.body,
      user: req.user?.id,
      userAgent: req.get('user-agent')
    });
    res.status(202).json({ accepted: true });
  })
};
