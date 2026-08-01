import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/users/notifications').then(({ data }) => setItems(data.items || [])).catch(() => setItems([]));
  }, []);

  const markRead = async (id) => {
    const { data } = await api.patch(`/users/notifications/${id}/read`);
    setItems((current) => current.map((item) => (item._id === id ? data.item : item)));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Notifications</h1>
      <div className="mt-6 grid gap-3">
        {items.length ? items.map((item) => (
          <article className="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" key={item._id}>
            <div>
              <h2 className="font-black">{item.title}</h2>
              <p className="text-sm text-zinc-500">{item.message}</p>
            </div>
            {!item.readAt && <button className="btn-secondary" onClick={() => markRead(item._id)}>Mark read</button>}
          </article>
        )) : <EmptyState title="No notifications" />}
      </div>
    </main>
  );
}
