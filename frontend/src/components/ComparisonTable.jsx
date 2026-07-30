import { ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';

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

const money = (price) =>
  price?.amount !== undefined
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency || 'INR', maximumFractionDigits: 0 }).format(price.amount)
    : '-';

export default function ComparisonTable({ comparison }) {
  const offers = comparison?.offers || [];
  const lowestId = comparison?.lowest?._id;
  const highestId = comparison?.highest?._id;

  if (!offers.length) {
    return <div className="panel text-sm text-zinc-500">No store offers are available for this product yet.</div>;
  }

  const getProviderKey = (store) => {
    if (!store) return '';
    if (typeof store === 'string') return store.toLowerCase().replace(/\s+/g, '');
    return (store.providerKey || store.name || '').toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800" role="table" aria-label="Store price comparison table">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">Store</th>
              <th scope="col" className="px-4 py-3 text-left">Price</th>
              <th scope="col" className="px-4 py-3 text-left">MRP</th>
              <th scope="col" className="px-4 py-3 text-left">Discount</th>
              <th scope="col" className="px-4 py-3 text-left">Delivery</th>
              <th scope="col" className="px-4 py-3 text-left">Availability</th>
              <th scope="col" className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {offers.map((offer) => {
              const key = getProviderKey(offer.store);
              const logoUrl = STORE_LOGOS[key] || null;
              const isLowest = offer._id === lowestId;
              const isHighest = offer._id === highestId;

              return (
                <tr
                  key={offer._id}
                  className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    isLowest ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''
                  } ${isHighest ? 'bg-rose-50 dark:bg-rose-950/20' : ''}`}
                >
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
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      offer.availability === 'in_stock'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
                    }`}>
                      {offer.availability === 'in_stock' ? 'In Stock' : offer.availability?.replace(/_/g, ' ') || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                      href={offer.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={14} /> Visit Store
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

