import { Brand, Category, Store } from '../models/index.js';
import { providerRegistry } from '../providers/providerRegistry.js';
import { BaseRepository } from '../repositories/base.repository.js';
import { buildTextFilter } from '../utils/apiFeatures.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { delCachePattern } from '../utils/cache.js';

const makeCrud = (Model, publicFilter = {}, cachePattern = 'http:/api/*') => {
  const repo = new BaseRepository(Model);
  return {
    list: asyncHandler(async (req, res) => {
      const data = await repo.list({ ...publicFilter, ...buildTextFilter(req.query, ['name', 'description']) }, req.query);
      res.json(data);
    }),
    create: asyncHandler(async (req, res) => {
      const item = await repo.create(req.body);
      await delCachePattern(cachePattern);
      res.status(201).json({ item });
    }),
    get: asyncHandler(async (req, res) => {
      const item = await repo.findById(req.params.id);
      if (!item) throw new AppError('Resource not found', 404);
      res.json({ item });
    }),
    update: asyncHandler(async (req, res) => {
      const item = await repo.updateById(req.params.id, req.body);
      if (!item) throw new AppError('Resource not found', 404);
      await delCachePattern(cachePattern);
      res.json({ item });
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await repo.deleteById(req.params.id);
      if (!item) throw new AppError('Resource not found', 404);
      await delCachePattern(cachePattern);
      res.status(204).send();
    })
  };
};

export const categoryController = makeCrud(Category, { isActive: true }, 'http:/api/categories*');
export const brandController = makeCrud(Brand, { isActive: true }, 'http:/api/brands*');

export const storeController = {
  ...makeCrud(Store, {}, 'http:/api/stores*'),
  providerStatus: asyncHandler(async (_req, res) => {
    res.json({ providers: providerRegistry.status() });
  })
};
