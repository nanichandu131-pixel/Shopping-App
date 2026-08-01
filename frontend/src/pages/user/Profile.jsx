import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../../api/client.js';
import { loadMe } from '../../store/slices/authSlice.js';

export default function Profile() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '', avatarUrl: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setForm({ name: data.user?.name || '', phone: data.user?.phone || '', avatarUrl: data.user?.avatarUrl || '' });
    });
  }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    await api.patch('/users/me', form);
    await dispatch(loadMe());
    setSaved(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-black">Profile</h1>
      <form onSubmit={submit} className="panel mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">Name<input className="input" name="name" value={form.name} onChange={update} required /></label>
        <label className="grid gap-2 text-sm font-semibold">Phone<input className="input" name="phone" value={form.phone} onChange={update} /></label>
        <label className="grid gap-2 text-sm font-semibold">Avatar URL<input className="input" name="avatarUrl" value={form.avatarUrl} onChange={update} /></label>
        {saved && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">Profile saved.</p>}
        <button className="btn-primary">Save profile</button>
      </form>
    </main>
  );
}
