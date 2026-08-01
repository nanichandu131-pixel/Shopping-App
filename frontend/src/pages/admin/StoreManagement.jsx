import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ name: '', providerKey: '', websiteUrl: '' });

  const load = () =>
    Promise.all([api.get('/stores'), api.get('/stores/integrations/providers/status')]).then(([storeData, providerData]) => {
      setStores(storeData.data.items || []);
      setProviders(providerData.data.providers || []);
    });

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const create = async (event) => {
    event.preventDefault();
    await api.post('/stores', form);
    setForm({ name: '', providerKey: '', websiteUrl: '' });
    load();
  };

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Store Integrations</h1>
      <form onSubmit={create} className="panel mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <input className="input" value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Store name" required />
        <input className="input" value={form.providerKey} onChange={(event) => setField('providerKey', event.target.value)} placeholder="Provider key" required />
        <input className="input" value={form.websiteUrl} onChange={(event) => setField('websiteUrl', event.target.value)} placeholder="Website URL" required />
        <button className="btn-primary">Add store</button>
      </form>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-black">Registered Stores</h2>
          <div className="grid gap-3">
            {stores.length ? stores.map((store) => (
              <article className="panel" key={store._id}>
                <h3 className="font-black">{store.name}</h3>
                <p className="text-sm text-zinc-500">{store.providerKey} - {store.health?.status || 'unknown'}</p>
              </article>
            )) : <EmptyState title="No stores registered" />}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-black">Provider Status</h2>
          <div className="grid gap-3">
            {providers.map((provider) => (
              <article className="panel flex items-center justify-between" key={provider.key}>
                <div>
                  <h3 className="font-black">{provider.name}</h3>
                  <p className="text-sm text-zinc-500">{provider.key}</p>
                </div>
                <span className={`rounded-md px-3 py-1 text-sm font-semibold ${provider.configured ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                  {provider.configured ? 'Configured' : 'Not configured'}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
