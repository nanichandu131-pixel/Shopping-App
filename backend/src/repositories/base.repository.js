import { getPagination, buildSort } from '../utils/apiFeatures.js';

export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id, populate = []) {
    let query = this.model.findById(id);
    populate.forEach((item) => {
      query = query.populate(item);
    });
    return query;
  }

  findOne(filter, options = {}) {
    return this.model.findOne(filter, null, options);
  }

  async list(filter = {}, queryParams = {}, populate = []) {
    const { page, limit, skip } = getPagination(queryParams);
    const sort = buildSort(queryParams.sort);
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    populate.forEach((item) => {
      query = query.populate(item);
    });

    const [items, total] = await Promise.all([query, this.model.countDocuments(filter)]);
    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    };
  }

  updateById(id, data, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}
