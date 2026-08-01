import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function AdminUsers() {
  const [items, setItems] = useState([]);

  const load = () => api.get('/admin/users').then(({ data }) => setItems(data.items || []));

  useEffect(() => {
    load().catch(() => setItems([]));
  }, []);

  const update = async (id, patch) => {
    const { data } = await api.patch(`/admin/users/${id}`, patch);
    setItems((current) => current.map((item) => (item._id === id ? data.user : item)));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-black">Users</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        {items.length ? (
          <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr><th className="px-4 py-3 text-left">User</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {items.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3"><p className="font-semibold">{user.name}</p><p className="text-zinc-500">{user.email}</p></td>
                  <td className="px-4 py-3">
                    <select className="input" value={user.role} onChange={(event) => update(user._id, { role: event.target.value })}>
                      <option value="user">user</option><option value="manager">manager</option><option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select className="input" value={user.status} onChange={(event) => update(user._id, { status: event.target.value })}>
                      <option value="active">active</option><option value="suspended">suspended</option><option value="deleted">deleted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="p-4"><EmptyState title="No users found" /></div>}
      </div>
    </main>
  );
}
