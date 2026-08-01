import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useMemo } from 'react';

// history: array of { observedAt, price: { amount }, store: { name } }
export default function PriceHistoryChart({ history = [] }) {
  if (!history.length) return null;

  const formatter = useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }), []);

  // Build dates and store series
  const { data, storeNames } = useMemo(() => {
    const datesSet = new Set();
    const stores = {};
    history.forEach((row) => {
      const dateObj = new Date(row.observedAt);
      const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      datesSet.add(date);
      const storeName = (row.store && row.store.name) || 'Unknown';
      stores[storeName] = stores[storeName] || {};
      stores[storeName][date] = row.price?.amount;
    });

    const dates = Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
    const storeNames = Object.keys(stores);
    const data = dates.map((date) => {
      const obj = { date };
      for (const s of storeNames) {
        obj[s] = stores[s][date] !== undefined ? Number(stores[s][date]) : null;
      }
      return obj;
    });
    return { data, storeNames };
  }, [history]);

  const colors = ['#18A999', '#FF6B5F', '#4F46E5', '#F59E0B', '#06B6D4'];

  return (
    <div role="img" aria-label="Price history chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => formatter.format(v)} />
          <Tooltip formatter={(value) => (value ? formatter.format(value) : '-') } />
          <Legend />
          {storeNames.map((storeName, idx) => (
            <Line
              key={storeName}
              type="monotone"
              dataKey={storeName}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
