import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import EmptyState from '../../components/EmptyState.jsx';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    api.get('/brands').then(({ data }) => setBrands(data.items || [])).catch(() => setBrands([]));
  }, []);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-black">Brands</h1>
      {brands.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link to={`/search?brand=${brand._id}`} key={brand._id} className="panel transition hover:-translate-y-1">
              {brand.logoUrl && <img src={brand.logoUrl} alt={brand.name} className="mb-4 h-14 object-contain" />}
              <h2 className="font-black">{brand.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{brand.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No brands configured" message="Create brands from the admin dashboard to list them here." />
      )}
    </main>
  );
}
