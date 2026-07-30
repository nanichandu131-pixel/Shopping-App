import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../api/client.js';

export default function ProductCard({ product, offer }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const item = product || offer?.product || offer;
  const title = item?.title || item?.name || offer?.title;
  const image = item?.images?.[0]?.url || item?.imageUrl || offer?.imageUrl;
  const id = item?._id || item?.id;
  const productId = product?._id || offer?.product?._id;
  const [livePrice, setLivePrice] = useState(null);
  const [priceDiff, setPriceDiff] = useState(null);

  // Simulate real-time price updates
  useEffect(() => {
    const basePrice = offer?.price?.amount || item?.price?.amount;
    if (!basePrice) return;
    
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newPrice = basePrice * (1 + variation);
      setLivePrice(newPrice);
      setPriceDiff(newPrice - basePrice);
    }, 30000 + Math.random() * 30000); // 30-60 seconds

    return () => clearInterval(interval);
  }, [offer?.price?.amount, item?.price?.amount]);

  const save = async () => {
    if (!accessToken || !productId) return;
    await api.post('/wishlist', { product: productId });
  };

  const trackBuy = () => {
    api.post('/analytics/events', { eventType: 'buy_click', product: productId, store: offer?.store?._id }).catch(() => {});
  };

  const displayPrice = livePrice || offer?.price?.amount || item?.price?.amount;
  const displayCurrency = offer?.price?.currency || item?.price?.currency || 'INR';

  const formatPrice = (price) =>
    price?.amount !== undefined
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency || 'INR', maximumFractionDigits: 0 }).format(price.amount)
      : price !== undefined
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: displayCurrency, maximumFractionDigits: 0 }).format(price)
        : 'Price unavailable';

  const priceObj = { amount: displayPrice, currency: displayCurrency };

  return (
    <article className="group rounded-lg border border-zinc-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <Link to={id ? `/products/${id}` : '/search'} className="block">
        <div className="aspect-square overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-contain transition group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-400">No product image</div>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-11 text-sm font-bold">{title}</h3>
      </Link>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div>
          <p className="font-black text-mint">{formatPrice(priceObj)}</p>
          {offer?.store?.name && <p className="text-xs text-zinc-500">{offer.store.name}</p>}
          {priceDiff !== null && priceDiff !== 0 && (
            <span className={`text-xs ${priceDiff > 0 ? 'text-rose-500' : 'text-emerald-500'} animate-pulse`}>
              {priceDiff > 0 ? '↑' : '↓'} {Math.abs(priceDiff) > 0 ? 'Live' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <Star size={14} className="fill-saffron text-saffron" />
          {item?.rating?.average || offer?.rating?.average || 'New'}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button aria-label="Save product" className="btn-secondary px-2 text-xs" onClick={save} disabled={!accessToken || !productId}>
          <Heart size={15} /> Save
        </button>
        {offer?.url ? (
          <a aria-label="Buy product" href={offer.url} target="_blank" rel="noreferrer" className="btn-primary px-2 text-xs" onClick={trackBuy}>
            <ShoppingCart size={15} /> Buy
          </a>
        ) : (
          <Link aria-label="Compare product" to={id ? `/products/${id}` : '/search'} className="btn-primary px-2 text-xs">
            Compare
          </Link>
        )}
      </div>
    </article>
  );
}
