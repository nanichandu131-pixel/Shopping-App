import { Bell, Clock, Heart, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import ProductCard from '../../components/ProductCard.jsx';
import StatCard from '../../components/StatCard.jsx';

export default function Dashboard() {
  const [data, setData] = useState({ wishlist: [], alerts: [], recent: [], unread: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/wishlist'),
      api.get('/alerts'),
      api.get('/users/recently-viewed'),
      api.get('/users/notifications/unread-count')
    ])
      .then(([wishlist, alerts, recent, unread]) =>
        setData({
          wishlist: wishlist.data.items || [],
          alerts: alerts.data.items || [],
          recent: recent.data.items || [],
          unread: unread.data.count || 0
        })
      )
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Wishlist" value={data.wishlist.length} icon={Heart} />
        <StatCard label="Active Alerts" value={data.alerts.length} icon={Bell} />
        <StatCard label="Recently Viewed" value={data.recent.length} icon={Clock} />
        <StatCard label="Unread" value={data.unread} icon={Search} />
      </div>
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Recently Viewed</h2>
          <Link className="btn-secondary" to="/wishlist">Open wishlist</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.recent.slice(0, 8).map((item) => item.product && <ProductCard key={item._id} product={item.product} />)}
        </div>
      </section>
    </main>
  );
}
