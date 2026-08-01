import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

export default function AdminAnalytics() {
  const [searches, setSearches] = useState([]);
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/admin/analytics/searches'), api.get('/admin/analytics/revenue')])
      .then(([searchData, revenueData]) => {
        setSearches(searchData.data.searches || []);
        setRevenue(revenueData.data.revenue || []);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Analytics</h1>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <h2 className="mb-4 text-xl font-black">Top Searches</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searches}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="query" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#18A999" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h2 className="mb-4 text-xl font-black">Buy Click Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#FF6B5F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
