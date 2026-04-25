export default function EmptyState({ title, description, icon = "📚" }) {
  return (
    <div className="bg-white border rounded-xl p-10 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
  );
}