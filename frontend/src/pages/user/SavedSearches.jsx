import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function SavedSearches() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  const load = () => api.get('/users/saved-searches').then(({ data }) => setItems(data.items || []));

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (query.trim().length < 2) return;
    await api.post('/users/saved-searches', { query: query.trim() });
    setQuery('');
    load();
  };

  const remove = async (id) => {
    await api.delete(`/users/saved-searches/${id}`);
    setItems((current) => current.filter((item) => item._id !== id));
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-black">Saved Searches</h1>
      <form className="panel mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={save}>
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search term to save" />
        <button className="btn-primary">Save</button>
      </form>
      <div className="mt-6 grid gap-3">
        {items.length ? items.map((item) => (
          <div className="panel flex items-center justify-between gap-4" key={item._id}>
            <Link className="font-semibold" to={`/search?q=${encodeURIComponent(item.query)}`}>{item.query}</Link>
            <button className="btn-secondary px-3" onClick={() => remove(item._id)} aria-label="Delete saved search">
              <Trash2 size={16} />
            </button>
          </div>
        )) : <EmptyState title="No saved searches" />}
      </div>
    </main>
  );
}
