export const getPagination = (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildSort = (sort = '-createdAt') =>
  String(sort)
    .split(',')
    .filter(Boolean)
    .join(' ');

export const buildTextFilter = (query, fields = ['name']) => {
  if (!query.q) return {};
  return {
    $or: fields.map((field) => ({ [field]: { $regex: String(query.q), $options: 'i' } }))
  };
};
