import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutLocal } from '../store/slices/authSlice.js';
import { toggleTheme } from '../store/slices/uiSlice.js';
import { Search, Menu, ShoppingCart, User, ChevronDown, Heart, Bell, Shield, Sun, Moon, LogOut } from 'lucide-react';
import { api } from '../api/client.js';
import { buildImageFallbackChain } from '../utils/imageFallback.js';
import { resizeImageUrl } from '../utils/responsiveImage.js';

export default function Navbar({ onMenuToggle }) {
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const megaRef = useRef(null);

  useEffect(() => {
    api.get('/categories?limit=20&isActive=true').then(({ data }) => {
      setCategories(data.items || data.categories || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setShowAccountMenu(false);
      if (megaRef.current && !megaRef.current.contains(e.target)) setShowMegaMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      try {
        const { data } = await api.get(`/products?q=${encodeURIComponent(val)}&limit=5`);
        setSuggestions(data.items || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const logout = () => {
    dispatch(logoutLocal());
    navigate('/');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-zinc-800"
          >
            <Menu size={20} />
            <span className="hidden md:inline">All</span>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 font-black tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-mint text-zinc-950 text-sm">SP</span>
            <span className="hidden sm:inline">SmartPrice</span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex">
              <input
                className="w-full rounded-l-md bg-white px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                value={query}
                onChange={handleInputChange}
                placeholder="Search products, brands and more..."
                aria-label="Search"
              />
              <button type="submit" className="rounded-r-md bg-mint px-4 text-zinc-950 hover:bg-teal-300">
                <Search size={20} />
              </button>
            </form>
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <img
                      src={resizeImageUrl(buildImageFallbackChain(product.images?.[0]?.url, product)[0], 64)}
                      alt=""
                      className="h-8 w-8 rounded object-cover"
                      loading="lazy"
                      decoding="async"
                      data-fallback-stage="0"
                      onError={(e) => {
                        const chain = buildImageFallbackChain(product.images?.[0]?.url, product);
                        const stage = Number(e.currentTarget.dataset.fallbackStage) + 1;
                        e.currentTarget.dataset.fallbackStage = stage;
                        e.currentTarget.src = resizeImageUrl(chain[Math.min(stage, chain.length - 1)], 64);
                      }}
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{product.title}</p>
                      {product.brand?.name && (
                        <p className="text-xs text-zinc-500">{product.brand.name}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-800"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Account Menu */}
            <div ref={accountRef} className="relative">
              <button
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-800"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <User size={18} />
                <span className="hidden md:inline text-xs">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown size={14} />
              </button>
              {showAccountMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-zinc-200 bg-white py-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                  {user ? (
                    <>
                      <div className="border-b px-4 pb-2 mb-2 dark:border-zinc-700">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        <User size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/wishlist" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        <Heart size={16} /> Wishlist
                      </Link>
                      {['admin', 'manager'].includes(user?.role) && (
                        <Link to="/admin" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800">
                          <Shield size={16} /> Admin
                        </Link>
                      )}
                      <hr className="my-2 dark:border-zinc-700" />
                      <button onClick={() => { setShowAccountMenu(false); logout(); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowAccountMenu(false)} className="block px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setShowAccountMenu(false)} className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
                        New customer? Start here
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="relative rounded-md px-2 py-1.5 hover:bg-zinc-800" aria-label="Wishlist">
                <Heart size={18} />
              </Link>
            )}
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="border-t border-zinc-800 bg-zinc-800">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-1 text-sm">
            <button
              onMouseEnter={() => setShowMegaMenu(true)}
              className="flex items-center gap-1 rounded px-2 py-1 font-semibold hover:bg-zinc-700"
            >
              <Menu size={16} /> Categories
            </button>
            <Link to="/deals" className="rounded px-2 py-1 hover:bg-zinc-700">Today's Deals</Link>
            <Link to="/brands" className="rounded px-2 py-1 hover:bg-zinc-700">Brands</Link>
            <Link to="/search?sort=-stats.viewCount" className="rounded px-2 py-1 hover:bg-zinc-700">Trending</Link>
            <Link to="/search?sort=-createdAt" className="rounded px-2 py-1 hover:bg-zinc-700">New Arrivals</Link>
            <span className="flex-1" />
            {user && (
              <Link to="/notifications" className="rounded px-2 py-1 hover:bg-zinc-700">
                <Bell size={16} className="inline" /> Notifications
              </Link>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        {showMegaMenu && (
          <div
            ref={megaRef}
            onMouseLeave={() => setShowMegaMenu(false)}
            className="absolute left-0 right-0 z-50 border-t border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-5 gap-6 px-4 py-6">
              <div>
                <h3 className="mb-3 text-sm font-black text-mint">📱 Electronics</h3>
                <ul className="space-y-1.5 text-sm">
                  {['Mobiles', 'Laptops', 'Tablets', 'Smart Watches', 'Earbuds', 'Headphones', 'Speakers', 'Cameras', 'Gaming Consoles', 'Smart TVs', 'Monitors', 'Keyboards', 'Mouse', 'Printers'].map((cat) => (
                    <li key={cat}>
                      <Link to={`/search?q=${encodeURIComponent(cat)}`} onClick={() => setShowMegaMenu(false)} className="text-zinc-600 hover:text-mint dark:text-zinc-400">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-black text-mint">👕 Fashion</h3>
                <ul className="space-y-1.5 text-sm">
                  {['T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Shorts', 'Hoodies', 'Jackets', 'Dresses', 'Sarees', 'Kurtis', 'Shoes', 'Sneakers', 'Sandals', 'Slippers', 'Watches', 'Bags', 'Wallets', 'Sunglasses'].map((cat) => (
                    <li key={cat}>
                      <Link to={`/search?q=${encodeURIComponent(cat)}`} onClick={() => setShowMegaMenu(false)} className="text-zinc-600 hover:text-mint dark:text-zinc-400">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-black text-mint">🏠 Home & Appliances</h3>
                <ul className="space-y-1.5 text-sm">
                  {['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwave Ovens', 'Vacuum Cleaner', 'Mixer', 'Grinder', 'Cookware', 'Water Purifier', 'Iron Box', 'Gas Stove', 'Furniture', 'Beds', 'Chairs', 'Dining Table', 'Sofa', 'Curtains'].map((cat) => (
                    <li key={cat}>
                      <Link to={`/search?q=${encodeURIComponent(cat)}`} onClick={() => setShowMegaMenu(false)} className="text-zinc-600 hover:text-mint dark:text-zinc-400">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-black text-mint">💄 Beauty & Personal Care</h3>
                <ul className="space-y-1.5 text-sm">
                  {['Face Wash', 'Face Cream', 'Sunscreen', 'Shampoo', 'Conditioner', 'Hair Oil', 'Perfume', 'Makeup', 'Lipstick', 'Trimmer', 'Hair Dryer', 'Beard Kit', 'Skin Care'].map((cat) => (
                    <li key={cat}>
                      <Link to={`/search?q=${encodeURIComponent(cat)}`} onClick={() => setShowMegaMenu(false)} className="text-zinc-600 hover:text-mint dark:text-zinc-400">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-black text-mint">📚 More</h3>
                <ul className="space-y-1.5 text-sm">
                  {['Power Banks', 'Chargers', 'SSD', 'Hard Drives', 'Memory Cards', 'Routers', 'Gaming Consoles', 'Cricket Equipment', 'Football', 'Badminton', 'Gym Equipment', 'Engineering Books', 'Programming Books', 'Story Books'].map((cat) => (
                    <li key={cat}>
                      <Link to={`/search?q=${encodeURIComponent(cat)}`} onClick={() => setShowMegaMenu(false)} className="text-zinc-600 hover:text-mint dark:text-zinc-400">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

