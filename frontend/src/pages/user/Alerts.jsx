import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function Alerts() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product: '', amount: '' });

  const load = () => api.get('/alerts').then(({ data }) => setItems(data.items || []));

  useEffect(() => {
    load().catch(() => setItems([]));
    api.get('/products', { params: { limit: 100 } }).then(({ data }) => setProducts(data.items || [])).catch(() => setProducts([]));
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/alerts', { product: form.product, targetPrice: { amount: Number(form.amount), currency: 'INR' } });
    setForm({ product: '', amount: '' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/alerts/${id}`);
    setItems((current) => current.filter((item) => item._id !== id));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-black">Price Alerts</h1>
      <form onSubmit={create} className="panel mt-6 grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <select className="input" value={form.product} onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))} required>
          <option value="">Select product</option>
          {products.map((product) => <option key={product._id} value={product._id}>{product.title}</option>)}
        </select>
        <input className="input" type="number" min="0" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} placeholder="Target price" required />
        <button className="btn-primary">Create alert</button>
      </form>
      <div className="mt-6 grid gap-3">
        {items.length ? items.map((item) => (
          <div className="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" key={item._id}>
            <div>
              <p className="font-black">{item.product?.title || 'Product'}</p>
              <p className="text-sm text-zinc-500">Target: INR {item.targetPrice?.amount}</p>
            </div>
            <button className="btn-secondary" onClick={() => remove(item._id)}>Delete</button>
          </div>
        )) : <EmptyState title="No alerts configured" />}
      </div>
    </main>
  );
}
