import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-rose-600">Invalid reset link</h1>
        <p className="mt-4 text-zinc-500">This password reset link is missing or invalid.</p>
        <Link to="/forgot-password" className="btn-primary mt-6 inline-block">Request new link</Link>
      </main>
    );
  }

  if (success) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <CheckCircle size={56} className="mx-auto mb-4 text-emerald-500" />
        <h1 className="text-3xl font-black">Password reset successful!</h1>
        <p className="mt-4 text-zinc-500">Redirecting you to login...</p>
        <Link to="/login" className="btn-primary mt-6 inline-block">Sign in now</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center px-4 py-10 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <p className="text-sm font-semibold text-mint">Secure reset</p>
        <h1 className="mt-2 text-4xl font-black">Reset your password</h1>
        <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">
          Choose a new password for your SmartPrice Compare account.
        </p>
      </section>
      <form onSubmit={submit} className="panel mt-8 grid gap-4 lg:mt-0">
        <h2 className="text-2xl font-black">New Password</h2>
        <label className="grid gap-2 text-sm font-semibold">
          New Password
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Confirm Password
          <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder="Repeat your password" />
        </label>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </main>
  );
}

