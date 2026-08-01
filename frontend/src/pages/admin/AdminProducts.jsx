import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';
import ProductCard from '../../components/ProductCard.jsx';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });

  const load = () => api.get('/products', { params: { limit: 40 } }).then(({ data }) => setItems(data.items || []));

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/products', {
      title: form.title,
      description: form.description,
      images: form.imageUrl ? [{ url: form.imageUrl, alt: form.title, sortOrder: 0 }] : []
    });
    setForm({ title: '', description: '', imageUrl: '' });
    load();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Products</h1>
      <form onSubmit={submit} className="panel mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <input className="input" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Product title" required />
        <input className="input" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" />
        <input className="input" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Image URL" />
        <button className="btn-primary">Add</button>
      </form>
      <section className="mt-6">
        {items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : <EmptyState title="No products" />}
      </section>
    </main>
  );
}
