import { useState } from 'react';
import { ExternalLink, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { buildImageFallbackChain } from '../utils/imageFallback.js';
import { resizeImageUrl } from '../utils/responsiveImage.js';
import { isValidHttpUrl } from '../utils/validateUrl.js';

// Real retailers' own logo assets get hotlink-blocked or 404 when loaded from
// a third-party origin, so store logos are generated locally as inline SVG
// data URIs instead of depending on any external image service.
const LOGO_COLORS = ['#6366f1', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];

const storeLogoUrl = (name) => {
  const label = name || 'Store';
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) hash = label.charCodeAt(i) + ((hash << 5) - hash);
  const color = LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
  const initials = label
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${color}"/><text x="32" y="32" font-family="system-ui,sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const money = (price) =>
  price?.amount !== undefined
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency || 'INR', maximumFractionDigits: 0 }).format(price.amount)
    : '-';

function OfferImage({ offer, product }) {
  const fallbackChain = buildImageFallbackChain(offer.imageUrl, product);
  const [stage, setStage] = useState(0);
  return (
    <img
      src={resizeImageUrl(fallbackChain[Math.min(stage, fallbackChain.length - 1)], 64)}
      alt=""
      className="h-10 w-10 rounded-md border border-zinc-200 object-contain dark:border-zinc-700"
      loading="lazy"
      decoding="async"
      onError={() => setStage((s) => Math.min(s + 1, fallbackChain.length - 1))}
    />
  );
}

export default function ComparisonTable({ comparison, product }) {
  const offers = comparison?.offers || [];
  const lowestId = comparison?.lowest?._id;
  const highestId = comparison?.highest?._id;

  if (!offers.length) {
    return <div className="panel text-sm text-zinc-500">No store offers are available for this product yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800" role="table" aria-label="Store price comparison table">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">Product</th>
              <th scope="col" className="px-4 py-3 text-left">Store</th>
              <th scope="col" className="px-4 py-3 text-left">Price</th>
              <th scope="col" className="px-4 py-3 text-left">MRP</th>
              <th scope="col" className="px-4 py-3 text-left">Discount</th>
              <th scope="col" className="px-4 py-3 text-left">Delivery</th>
              <th scope="col" className="px-4 py-3 text-left">Rating</th>
              <th scope="col" className="px-4 py-3 text-left">Availability</th>
              <th scope="col" className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {offers.map((offer) => {
              const logoUrl = storeLogoUrl(offer.store?.name);
              const isLowest = offer._id === lowestId;
              const isHighest = offer._id === highestId;
              const canVisit = isValidHttpUrl(offer.url);

              return (
                <tr
                  key={offer._id}
                  className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    isLowest ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''
                  } ${isHighest ? 'bg-rose-50 dark:bg-rose-950/20' : ''}`}
                >
                  <td className="px-4 py-3">
                    <OfferImage offer={offer} product={product} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {logoUrl && (
                        <img src={logoUrl} alt={offer.store?.name || 'Store'} className="h-6 w-16 object-contain" loading="lazy" />
                      )}
                      <span className="font-semibold">{offer.store?.name || 'Unknown Store'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-black">
                      {isLowest && <TrendingDown size={16} className="text-emerald-600" />}
                      {isHighest && <TrendingUp size={16} className="text-rose-600" />}
                      {money(offer.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 line-through">{money(offer.mrp)}</td>
                  <td className="px-4 py-3">
                    {offer.discountPercent > 0 ? (
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                        {offer.discountPercent}% off
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {offer.deliveryCharge?.amount === 0 ? (
                      <span className="text-emerald-600 font-semibold text-xs">Free</span>
                    ) : (
                      money(offer.deliveryCharge)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {offer.rating?.average ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        <Star size={13} className="fill-saffron text-saffron" />
                        {offer.rating.average.toFixed(1)}
                        {offer.rating.count ? <span className="text-zinc-400">({offer.rating.count})</span> : null}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      offer.availability === 'in_stock'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
                    }`}>
                      {offer.availability === 'in_stock' ? 'In Stock' : offer.availability?.replace(/_/g, ' ') || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {canVisit ? (
                      <a
                        className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                        href={offer.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Opens the store's own site — price and availability there may differ from what's shown here"
                      >
                        <ExternalLink size={14} /> Visit Store
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">Link unavailable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Prices shown are for comparison purposes and may not match the live price on the retailer's own site.
      </p>
    </div>
  );
}

