export default function BookFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border rounded-xl p-4 mb-6 grid md:grid-cols-3 gap-3"
    >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title/author"
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 transition">
        Apply Filters
      </button>
    </form>
  );
}