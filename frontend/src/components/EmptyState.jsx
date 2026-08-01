import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className="panel grid place-items-center py-12 text-center">
      <SearchX className="mb-3 text-zinc-400" size={36} />
      <h2 className="font-black">{title}</h2>
      {message && <p className="mt-2 max-w-xl text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
