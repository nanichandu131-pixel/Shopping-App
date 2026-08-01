import { Notification } from '../models/index.js';

export const notificationService = {
  list(userId, query) {
    const filter = { user: userId };
    if (query.unread === 'true') filter.readAt = null;
    return Notification.find(filter).sort({ createdAt: -1 }).limit(Math.min(Number(query.limit || 30), 100));
  },
  markRead(userId, id) {
    return Notification.findOneAndUpdate({ _id: id, user: userId }, { readAt: new Date() }, { new: true });
  },
  create(data) {
    return Notification.create(data);
  }
};
