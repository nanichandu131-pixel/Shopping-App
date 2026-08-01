export default function Skeleton({ rows = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      ))}
    </div>
  );
}
