import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';
import ProductCard from '../../components/ProductCard.jsx';

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/wishlist').then(({ data }) => setItems(data.items || [])).catch(() => setItems([]));
  }, []);

  const remove = async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    setItems((current) => current.filter((item) => item.product?._id !== productId));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Wishlist</h1>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item._id} className="grid gap-2">
              <ProductCard product={item.product} />
              <button className="btn-secondary" onClick={() => remove(item.product?._id)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No wishlist items" message="Save products from product cards to track them here." />
      )}
    </main>
  );
}
