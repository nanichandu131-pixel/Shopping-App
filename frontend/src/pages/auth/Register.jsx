import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../store/slices/authSlice.js';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitError, setSubmitError] = useState('');

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    try {
      await dispatch(register(form)).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (message) {
      setSubmitError(message);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center px-4 py-10 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <p className="text-sm font-semibold text-coral">Start comparing smarter</p>
        <h1 className="mt-2 text-4xl font-black">Create your SmartPrice profile.</h1>
        <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">
          Save products, receive price alerts, and keep your shopping research organized across devices.
        </p>
      </section>
      <form onSubmit={submit} className="panel mt-8 grid gap-4 lg:mt-0">
        <h2 className="text-2xl font-black">Register</h2>
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <input className="input" name="name" value={form.name} onChange={update} required minLength={2} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input className="input" type="email" name="email" value={form.email} onChange={update} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <input className="input" type="password" name="password" value={form.password} onChange={update} required minLength={8} />
        </label>
        {(submitError || error) && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{submitError || error}</p>}
        <button className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-sm text-zinc-500">
          Already registered? <Link className="font-semibold text-mint" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
