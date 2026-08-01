import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initial = '', large = false }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const query = q.trim();
    if (query.length >= 2) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={submit} className={`flex w-full gap-2 ${large ? 'max-w-3xl' : 'max-w-xl'}`}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
        <input
          className={`${large ? 'py-4 text-base' : 'py-3 text-sm'} input pl-12`}
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search phones, shoes, laptops, appliances..."
          aria-label="Search products"
        />
      </div>
      <button className="btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
