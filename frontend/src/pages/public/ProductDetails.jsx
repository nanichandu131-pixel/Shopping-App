import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, fetchComparison } from '../../store/slices/productSlice.js';
import ComparisonTable from '../../components/ComparisonTable.jsx';
import PriceHistoryChart from '../../components/PriceHistoryChart.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { api } from '../../api/client.js';
import { buildImageFallbackChain } from '../../utils/imageFallback.js';
import { buildSrcSet, resizeImageUrl } from '../../utils/responsiveImage.js';
import { isValidHttpUrl } from '../../utils/validateUrl.js';
import { ShoppingCart, Star, Heart, Share2, ChevronLeft, ChevronRight, Check, Truck, RotateCcw, Shield, Clock } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, comparison } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeImage, setActiveImage] = useState(0);
  const [imgStage, setImgStage] = useState(0);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setImgStage(0);
    Promise.all([
      dispatch(fetchProduct(id)),
      dispatch(fetchComparison(id)),
      api.get(`/products/${id}/similar`).then(({ data }) => setSimilar(data.products || [])).catch(() => {}),
      api.get(`/products/${id}/reviews`).then(({ data }) => setReviews(data.reviews || [])).catch(() => {})
    ]).finally(() => setLoading(false));
  }, [dispatch, id]);

  const addToWishlist = async () => {
    if (!user) return;
    await api.post('/wishlist', { product: id }).catch(() => {});
  };

  const product = selected?.product;
  const offers = selected?.offers || comparison?.offers || [];
  const history = selected?.priceHistory || [];
  const images = product?.images || [];
  const specs = product?.specifications || [];
  const fallbackChain = useMemo(
    () => buildImageFallbackChain(images[activeImage]?.url, product),
    [images, activeImage, product]
  );
  const displayImage = fallbackChain[Math.min(imgStage, fallbackChain.length - 1)];

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Product not found</h1>
        <p className="mt-4 text-zinc-500">This product may have been removed or doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">Back to Home</Link>
      </main>
    );
  }

  const bestOffer = offers.length > 0 ? offers.reduce((min, o) => (o.price?.amount < min.price?.amount ? o : min), offers[0]) : null;
  const lowestPrice = bestOffer?.price?.amount;
  const mrp = bestOffer?.mrp?.amount;
  const discount = bestOffer?.discountPercent || (mrp && lowestPrice ? Math.round((1 - lowestPrice / mrp) * 100) : 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-zinc-500">
        <Link to="/" className="hover:text-mint">Home</Link>
        {product.category && <><ChevronRight size={14} /><Link to={`/search?category=${product.category._id || product.category}`} className="hover:text-mint">{product.category?.name || 'Category'}</Link></>}
        {product.brand && <><ChevronRight size={14} /><span className="hover:text-mint">{product.brand?.name}</span></>}
        <ChevronRight size={14} />
        <span className="truncate text-zinc-800 dark:text-zinc-200">{product.title}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <img
              src={resizeImageUrl(displayImage, 800)}
              srcSet={buildSrcSet(displayImage, [400, 800, 1200])}
              sizes="(min-width: 1024px) 500px, 100vw"
              alt={images[activeImage]?.alt || product.title}
              className="h-full w-full object-contain p-4"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              onError={() => setImgStage((stage) => Math.min(stage + 1, fallbackChain.length - 1))}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => { setActiveImage((prev) => (prev - 1 + images.length) % images.length); setImgStage(0); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white dark:bg-zinc-800/80"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => { setActiveImage((prev) => (prev + 1) % images.length); setImgStage(0); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white dark:bg-zinc-800/80"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImage(idx); setImgStage(0); }}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
                    idx === activeImage ? 'border-mint' : 'border-transparent'
                  }`}
                >
                  <img
                    src={resizeImageUrl(img.url, 100)}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = fallbackChain[fallbackChain.length - 1]; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.brand?.name && (
            <p className="text-sm font-semibold text-mint">{product.brand.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-black leading-tight lg:text-3xl">{product.title}</h1>
          {product.modelNumber && (
            <p className="mt-1 text-sm text-zinc-500">Model: {product.modelNumber}</p>
          )}

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-sm font-bold text-white">
              {product.rating?.average || 0} <Star size={14} fill="white" />
            </div>
            <span className="text-sm text-zinc-500">
              {product.rating?.count || 0} ratings
            </span>
            {reviews.length > 0 && (
              <span className="text-sm text-zinc-500">{reviews.length} reviews</span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-baseline gap-3">
              {lowestPrice && (
                <span className="text-3xl font-black">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </span>
              )}
              {mrp && mrp > lowestPrice && (
                <span className="text-lg text-zinc-400 line-through">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-sm font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  {discount}% off
                </span>
              )}
            </div>
            {bestOffer?.store?.name && (
              <p className="mt-1 text-sm text-zinc-500">Lowest price on {bestOffer.store.name}</p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {bestOffer?.url && isValidHttpUrl(bestOffer.url) ? (
              <a
                href={bestOffer.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-coral hover:bg-rose-600"
              >
                <ShoppingCart size={18} /> Buy at Best Price
              </a>
            ) : (
              <button className="btn-primary bg-coral hover:bg-rose-600">
                <ShoppingCart size={18} /> Compare Prices
              </button>
            )}
            <button className="btn-secondary" onClick={addToWishlist} disabled={!user}>
              <Heart size={18} /> Save
            </button>
            <button className="btn-secondary">
              <Share2 size={18} /> Share
            </button>
          </div>

          {/* Key Features */}
          <div className="mt-6 grid gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-sm">
              <Truck size={18} className="text-mint" />
              <span>Free delivery on orders above ₹499</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw size={18} className="text-mint" />
              <span>7 days easy replacement</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield size={18} className="text-mint" />
              <span>Secure transaction</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={18} className="text-mint" />
              <span>Price history tracked for 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Specifications</h2>
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {specs.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-900/50' : 'bg-white dark:bg-zinc-950'}>
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">{spec.name}</td>
                    <td className="px-4 py-3 text-sm">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Store Comparison */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-black">Compare Prices Across Stores</h2>
        <ComparisonTable comparison={comparison} product={product} />
      </section>

      {/* Price History */}
      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Price History (30 days)</h2>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <PriceHistoryChart history={history} />
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Customer Reviews</h2>
          <div className="grid gap-4">
            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-emerald-600">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-emerald-600' : 'text-zinc-300'} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{review.user?.name || 'Anonymous'}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {review.title && <h4 className="mt-2 font-bold">{review.title}</h4>}
                {review.body && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{review.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Similar Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similar.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
