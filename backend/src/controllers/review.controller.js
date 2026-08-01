import { Review } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const reviewController = {
  create: asyncHandler(async (req, res) => {
    const review = await Review.create({ ...req.body, user: req.user.id, status: 'pending' });
    res.status(201).json({ review });
  }),
  myReviews: asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user.id }).populate('product').sort({ createdAt: -1 });
    res.json({ reviews });
  })
};
