export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 text-slate-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span>{text}</span>
      </div>
    </div>
  );
}