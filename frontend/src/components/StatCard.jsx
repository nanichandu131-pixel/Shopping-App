export default function StatCard({ label, value, tone = 'mint' }) {
  const tones = {
    mint: 'bg-mint/10 text-mint',
    coral: 'bg-coral/10 text-coral',
    saffron: 'bg-saffron/10 text-amber-600'
  };
  return (
    <div className="panel">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-md px-3 py-1 text-3xl font-black ${tones[tone]}`}>{value ?? 0}</p>
    </div>
  );
}
