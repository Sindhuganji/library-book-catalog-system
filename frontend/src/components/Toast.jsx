export default function Toast({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";

  return (
    <div className={`fixed top-4 right-4 z-50 border rounded-lg px-4 py-3 shadow ${styles}`}>
      <div className="flex items-center gap-4">
        <p className="text-sm">{message}</p>
        <button className="text-xs underline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}