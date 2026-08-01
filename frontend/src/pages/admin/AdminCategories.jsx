import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const load = () => api.get('/categories', { params: { limit: 100 } }).then(({ data }) => setItems(data.items || []));

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/categories', { name });
    setName('');
    load();
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-black">Categories</h1>
      <form onSubmit={create} className="panel mt-6 flex flex-col gap-3 sm:flex-row">
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" required />
        <button className="btn-primary">Create</button>
      </form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.length ? items.map((item) => (
          <article className="panel" key={item._id}>
            <h2 className="font-black">{item.name}</h2>
            <p className="mt-2 text-sm text-zinc-500">{item.description || 'No description'}</p>
          </article>
        )) : <EmptyState title="No categories" />}
      </div>
    </main>
  );
}
