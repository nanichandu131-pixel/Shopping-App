import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice.js';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    try {
      await dispatch(login(form)).unwrap();
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (message) {
      setSubmitError(message);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl items-center px-4 py-10 lg:grid-cols-[1fr_0.8fr] gap-8">
      <section className="animate-slide-in-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint/10 px-4 py-1.5 text-sm font-semibold text-mint animate-fade-in">
          <LogIn size={16} /> SmartPrice account
        </div>
        <h1 className="mt-4 text-4xl font-black leading-tight">
          Sign in to track prices<br />
          <span className="bg-gradient-to-r from-mint to-teal-400 bg-clip-text text-transparent">and manage alerts.</span>
        </h1>
        <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Your account keeps wishlists, saved searches, price alerts, and admin tools in sync with the API.
        </p>
        
        {/* Feature highlights */}
        <div className="mt-8 space-y-3 stagger-children">
          {[
            { icon: '🔔', text: 'Real-time price alerts' },
            { icon: '❤️', text: 'Save products to wishlist' },
            { icon: '📊', text: 'Compare prices across stores' },
            { icon: '📈', text: 'Track price history' },
          ].map((feature) => (
            <div key={feature.text} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="text-lg">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={submit} className="animate-slide-in-right panel-glass mt-8 grid gap-5 lg:mt-0">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal-400 shadow-lg animate-float">
            <LogIn size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-black">Welcome Back</h2>
          <p className="mt-1 text-sm text-zinc-500">Sign in to your account</p>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Mail size={16} className="text-mint" /> Email
          </span>
          <div className="relative">
            <input
              className="input-glass pl-10"
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              required
            />
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Lock size={16} className="text-mint" /> Password
          </span>
          <div className="relative">
            <input
              className="input-glass pl-10 pr-10"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={update}
              placeholder="Enter your password"
              required
            />
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {(submitError || error) && (
          <div className="animate-scale-in rounded-md bg-rose-50/80 p-3 text-sm text-rose-700 backdrop-blur-sm dark:bg-rose-900/30 dark:text-rose-400">
            {submitError || error}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="rounded border-zinc-300 text-mint focus:ring-mint" /> 
            <span className="text-zinc-600 dark:text-zinc-400">Remember me</span>
          </label>
          <Link className="font-semibold text-mint transition hover:text-teal-400 hover:underline" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button className="btn-primary-glow w-full" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in <ArrowRight size={18} />
            </span>
          )}
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500">
          New here?{' '}
          <Link className="font-semibold text-mint transition hover:text-teal-400" to="/register">
            Create an account <ArrowRight size={14} className="inline" />
          </Link>
        </p>
      </form>
    </main>
  );
}
