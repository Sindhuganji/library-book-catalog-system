import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import BookCard from '../components/books/BookCard';
import api from '../services/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [borrowingId, setBorrowingId] = useState("");
  const [error, setError] = useState("");

  // Restored search/filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[Books] Fetching books...");

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      console.log("[Books] Query params:", params);

      const res = await api.get("/books", { params });
      const list = Array.isArray(res.data) ? res.data : res.data.books || [];
      setBooks(list);

      console.log("[Books] Books loaded:", list.length);
    } catch (err) {
      console.error("[Books] fetchBooks error:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBorrow = async (bookId) => {
    console.log("[Books] handleBorrow triggered with bookId:", bookId);

    if (!bookId) {
      setError("Invalid book id");
      return;
    }

    try {
      setBorrowingId(bookId);
      setError("");

      // Consistent endpoint with backend fix
      const endpoint = `/books/${bookId}/borrow`;
      console.log("[Books] Calling endpoint:", endpoint);

      const res = await api.post(endpoint);
      console.log("[Books] Borrow success:", res.data);

      await fetchBooks(); // refresh list to show updated availability
    } catch (err) {
      console.error("[Books] Borrow error:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowingId("");
    }
  };

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category).filter(Boolean))],
    [books]
  );

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Books</h2>

      {/* Restored Search/Filter UI */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white border rounded-xl p-4 mb-6 grid md:grid-cols-3 gap-3"
      >
        <input
          type="text"
          placeholder="Search by title / author / category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700"
        >
          Apply
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-slate-500">No books found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={handleBorrow}
              isBorrowing={borrowingId === book._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}