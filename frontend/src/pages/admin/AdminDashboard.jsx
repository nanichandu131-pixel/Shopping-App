import { BarChart3, Boxes, Bell, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import ProductCard from '../../components/ProductCard.jsx';
import StatCard from '../../components/StatCard.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState({ users: 0, products: 0, offers: 0, alerts: 0, bestDeals: [], trending: [] });

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data: next }) => setData(next)).catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-mint">Admin</p>
          <h1 className="text-3xl font-black">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-secondary" to="/admin/products"><Boxes size={16} /> Products</Link>
          <Link className="btn-secondary" to="/admin/analytics"><BarChart3 size={16} /> Analytics</Link>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={data.users} tone="mint" icon={Users} />
        <StatCard label="Products" value={data.products} tone="coral" icon={Boxes} />
        <StatCard label="Offers" value={data.offers} tone="saffron" />
        <StatCard label="Alerts" value={data.alerts} tone="mint" icon={Bell} />
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-black">Best Deals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(data.bestDeals || []).map((offer) => <ProductCard key={offer._id} offer={offer} />)}
        </div>
      </section>
    </main>
  );
}
