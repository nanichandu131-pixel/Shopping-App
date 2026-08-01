import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../../store/slices/productSlice.js';
import ProductCard from '../../components/ProductCard.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { api } from '../../api/client.js';
import { SlidersHorizontal, ChevronDown, X, Filter } from 'lucide-react';

const STORE_LOGOS = {
  amazon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  flipkart: 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
  croma: 'https://www.croma.com/croma-logo.svg',
  reliancedigital: 'https://www.reliancedigital.in/build/client/images/logo.png',
  vijaysales: 'https://www.vijaysales.com/themes/custom/vs_theme/logo.svg',
  tatacliq: 'https://www.tatacliq.com/logo.svg',
  myntra: 'https://www.myntra.com/favicon.ico',
  ajio: 'https://www.ajio.com/favicon.ico',
  meesho: 'https://www.meesho.com/favicon.ico',
  snapdeal: 'https://www.snapdeal.com/favicon.ico',
  applestore: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  samsungstore: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  vivostore: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Vivo_Logo.svg',
  oppostore: 'https://upload.wikimedia.org/wikipedia/commons/4/47/OPPO_Logo.svg',
  xiaomistore: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo.svg',
  oneplusstore: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/OnePlus_logo.svg',
  realmestore: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Realme_Logo.svg',
  motorolastore: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Motorola_logo.svg',
  ipoint: 'https://www.ipoint.in/favicon.ico'
};

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const dispatch = useDispatch();
  const { items, providerResults, meta, status } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentRating = searchParams.get('minRating') || '';

  useEffect(() => {
    dispatch(searchProducts(Object.fromEntries(searchParams.entries())));
    api.get('/categories?isActive=true&limit=50').then(({ data }) => setCategories(data.items || data.categories || [])).catch(() => {});
    api.get('/brands?isActive=true&limit=50').then(({ data }) => setBrands(data.items || data.brands || [])).catch(() => {});
  }, [dispatch, searchParams]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    setSearchParams(params);
  };

  const liveOffers = (providerResults || []).filter((item) => !item.error);
  const errors = (providerResults || []).filter((item) => item.error);
  const totalResults = (items?.length || 0) + (liveOffers?.length || 0);
  const hasActiveFilters = currentCategory || currentBrand || minPrice || maxPrice || currentSort || currentRating;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black lg:text-3xl">
          {q ? `Results for "${q}"` : 'Search Products'}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {meta?.total || totalResults} products found
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-3 text-mint hover:underline">Clear all filters</button>
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className={`lg:block ${showFilters ? 'fixed inset-0 z-50 overflow-y-auto bg-white p-6 dark:bg-zinc-950 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 dark:lg:bg-transparent' : 'hidden'}`}>
          {showFilters && (
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="text-lg font-black">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="btn-secondary px-2 py-1"><X size={20} /></button>
            </div>
          )}

          <div className="space-y-6">
            {/* Sort */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Sort By</h3>
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input text-sm"
              >
                <option value="">Relevance</option>
                <option value="-stats.viewCount">Most Viewed</option>
                <option value="-rating.average">Highest Rated</option>
                <option value="-stats.compareCount">Most Compared</option>
                <option value="title">Name A-Z</option>
                <option value="-title">Name Z-A</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Category</h3>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter('category', cat._id === currentCategory ? '' : cat._id)}
                    className={`block w-full rounded px-2 py-1 text-left text-sm transition ${
                      cat._id === currentCategory ? 'bg-mint/10 font-semibold text-mint' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Brand</h3>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => updateFilter('brand', brand._id === currentBrand ? '' : brand._id)}
                    className={`block w-full rounded px-2 py-1 text-left text-sm transition ${
                      brand._id === currentBrand ? 'bg-mint/10 font-semibold text-mint' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="input w-1/2 text-sm"
                />
                <span className="text-zinc-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="input w-1/2 text-sm"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Minimum Rating</h3>
              <div className="flex gap-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('minRating', rating === Number(currentRating) ? '' : String(rating))}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                      rating === Number(currentRating) ? 'bg-mint text-white' : 'border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {rating}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="btn-secondary mb-4 lg:hidden"
          >
            <Filter size={18} /> Filters {hasActiveFilters && `(${Object.entries({currentCategory, currentBrand, minPrice, maxPrice, currentSort, currentRating}).filter(([_, v]) => v).length})`}
          </button>

          {status === 'loading' ? (
            <Skeleton rows={8} />
          ) : totalResults > 0 ? (
            <>
              {items?.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 text-xl font-black">Catalog Results</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </section>
              )}
              {liveOffers?.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-black">Live Store Offers</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {liveOffers.map((offer, idx) => (
                      <ProductCard key={`${offer.provider}-${idx}`} offer={offer} />
                    ))}
                  </div>
                </section>
              )}

              {/* Pagination */}
              {meta?.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: Math.min(meta.pages, 5) }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => updateFilter('page', String(page))}
                        className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                          (meta.page || 1) === page ? 'bg-mint text-white' : 'border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No products found"
              message={q ? `No results for "${q}". Try different keywords or check your filters.` : 'Browse categories or use the search bar to find products.'}
            />
          )}

          {/* Provider Errors */}
          {errors.length > 0 && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Some store providers could not respond: {errors.map((item) => item.store).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

