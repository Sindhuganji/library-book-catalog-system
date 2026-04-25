export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-4 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
      <div className="h-9 bg-slate-200 rounded" />
    </div>
  );
}

export function DashboardItemSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-4 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-1/4" />
    </div>
  );
}