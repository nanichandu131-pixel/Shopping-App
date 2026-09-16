import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import ProductCard from '../../components/ProductCard.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { ChevronRight, Star, TrendingUp, Zap, ShoppingBag } from 'lucide-react';
import { LOCAL_PLACEHOLDER_IMAGE } from '../../utils/imageFallback.js';
import { buildSrcSet, resizeImageUrl } from '../../utils/responsiveImage.js';

const heroSlides = [
  {
    img: 'https://media.slidesgo.com/storage/22965248/online-shopping-mk-plan1657864463.jpg',
    title: 'Biggest Deals of the Season',
    subtitle: 'Up to 70% off on Electronics, Fashion & More',
    cta: 'Shop Now',
    link: '/deals'
  },
  {
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80',
    title: 'Compare Prices Across Stores',
    subtitle: 'Find the best prices on Amazon, Flipkart, Croma & more',
    cta: 'Start Comparing',
    link: '/search?q=iphone'
  },
  {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80',
    title: 'New Season Fashion',
    subtitle: 'Trendy styles at unbeatable prices',
    cta: 'Explore Fashion',
    link: '/search?q=fashion'
  }
];

const categoryGrid = [
  { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&q=80', link: '/search?q=mobiles' },
  { name: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&q=80', link: '/search?q=laptops' },
  { name: 'Smart Watches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&q=80', link: '/search?q=smart+watches' },
  { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&q=80', link: '/search?q=headphones' },
  { name: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80', link: '/search?q=shoes' },
  { name: 'Cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop&q=80', link: '/search?q=cameras' },
  { name: 'Smart TVs', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop&q=80', link: '/search?q=smart+tvs' },
  { name: 'Fashion', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop&q=80', link: '/search?q=fashion' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [deals, setDeals] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);

  useEffect(() => {
    api.get('/products?sort=-stats.viewCount&limit=8').then(({ data }) => {
      setTrending(data.items || []);
      setLoadingTrending(false);
    }).catch(() => setLoadingTrending(false));

    api.get('/products/deals?limit=8').then(({ data }) => {
      setDeals(data.items || []);
      setLoadingDeals(false);
    }).catch(() => setLoadingDeals(false));
  }, []);

  // Auto rotate hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-zinc-900">
        <div className="relative mx-auto max-w-7xl">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`transition-opacity duration-700 ${idx === slideIndex ? 'opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'}`}
            >
              <img
                src={slide.img}
                srcSet={buildSrcSet(slide.img, [640, 1200, 1800])}
                sizes="100vw"
                alt=""
                className="h-[300px] w-full object-cover md:h-[400px] lg:h-[500px]"
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchpriority={idx === 0 ? 'high' : undefined}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <h1 className="max-w-2xl text-2xl font-black text-white md:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-lg">
                  {slide.subtitle}
                </p>
                <Link to={slide.link} className="btn-primary mt-4 inline-flex bg-mint text-zinc-950 hover:bg-teal-300">
                  {slide.cta} <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${idx === slideIndex ? 'w-6 bg-mint' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Zap size={24} className="text-mint" /> Shop by Category
          </h2>
          <Link to="/search" className="text-sm font-semibold text-mint hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categoryGrid.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group rounded-lg border border-zinc-200 bg-white p-3 text-center transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={resizeImageUrl(cat.img, 160)}
                  srcSet={buildSrcSet(cat.img, [80, 160, 240])}
                  sizes="80px"
                  alt={cat.name}
                  className="h-full w-full object-cover transition group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = LOCAL_PLACEHOLDER_IMAGE; }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <TrendingUp size={24} className="text-coral" /> Trending Products
          </h2>
          <Link to="/search?sort=-stats.viewCount" className="text-sm font-semibold text-mint hover:underline">View All</Link>
        </div>
        {loadingTrending ? (
          <Skeleton rows={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Best Deals */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Zap size={24} className="text-saffron" /> Best Deals
          </h2>
          <Link to="/deals" className="text-sm font-semibold text-mint hover:underline">View All</Link>
        </div>
        {loadingDeals ? (
          <Skeleton rows={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {deals.map((deal) => (
              <ProductCard key={deal._id} offer={deal} />
            ))}
          </div>
        )}
      </section>

      {/* Features Strip */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
          <div className="text-center">
            <ShoppingBag size={28} className="mx-auto mb-2 text-mint" />
            <h3 className="font-bold">Compare Prices</h3>
            <p className="text-sm text-zinc-500">Amazon, Flipkart, Croma & 7 more stores</p>
          </div>
          <div className="text-center">
            <Star size={28} className="mx-auto mb-2 text-saffron" />
            <h3 className="font-bold">Real Reviews</h3>
            <p className="text-sm text-zinc-500">Verified ratings from real buyers</p>
          </div>
          <div className="text-center">
            <TrendingUp size={28} className="mx-auto mb-2 text-coral" />
            <h3 className="font-bold">Price History</h3>
            <p className="text-sm text-zinc-500">Track price drops over 30 days</p>
          </div>
        </div>
      </section>
    </main>
  );
}

