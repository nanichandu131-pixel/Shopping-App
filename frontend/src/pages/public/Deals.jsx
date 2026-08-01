import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';
import ProductCard from '../../components/ProductCard.jsx';

export default function Deals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get('/products/deals').then(({ data }) => setDeals(data.items || [])).catch(() => setDeals([]));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Best Deals</h1>
      {deals.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((offer) => <ProductCard key={offer._id} offer={offer} />)}
        </div>
      ) : (
        <EmptyState title="No deals yet" message="Deals appear when real store offers are synced with discount information." />
      )}
    </main>
  );
}
