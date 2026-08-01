import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center px-4 py-10 lg:grid-cols-[1fr_0.8fr]">
        <section>
          <h1 className="text-4xl font-black">Check your email</h1>
          <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">
            If an account exists with that email, we've sent password reset instructions.
          </p>
        </section>
        <div className="panel mt-8 text-center lg:mt-0">
          <Mail size={48} className="mx-auto mb-4 text-mint" />
          <h2 className="text-xl font-black">Email sent</h2>
          <p className="mt-2 text-sm text-zinc-500">Please check your inbox and follow the link to reset your password.</p>
          <Link to="/login" className="btn-primary mt-6 inline-block">Back to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center px-4 py-10 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <p className="text-sm font-semibold text-mint">Password reset</p>
        <h1 className="mt-2 text-4xl font-black">Forgot your password?</h1>
        <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </section>
      <form onSubmit={submit} className="panel mt-8 grid gap-4 lg:mt-0">
        <h2 className="text-2xl font-black">Reset Password</h2>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
        </label>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p className="text-sm text-zinc-500">
          Remember your password? <Link className="font-semibold text-mint" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}

