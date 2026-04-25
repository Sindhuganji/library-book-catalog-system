import {
  useEffect,
  useState,
} from 'react';

import EmptyState from '../components/common/EmptyState';
import { DashboardItemSkeleton } from '../components/common/Skeleton';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState("");
  const [error, setError] = useState("");

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/borrow/my-books");
      setRecords(res.data.records || []);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to fetch borrowed books"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // ✅ RETURN FUNCTION (WITH LOADING + ALERT)
  const handleReturn = async (bookId) => {
    try {
      setReturningId(bookId);
      await api.post(`/borrow/return/${bookId}`);
      alert("Book returned ✅");
      await fetchMyBooks();
    } catch (e) {
      alert("Failed ❌");
      setError(getErrorMessage(e, "Return failed"));
    } finally {
      setReturningId("");
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">My Borrowed Books</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardItemSkeleton key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No borrowed books"
          description="Borrow books from the Books page to see them here."
        />
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const recordId = record._id;
            const isBorrowed = record.status === "borrowed";
            const bookId = record.bookId?._id;

            return (
              <div
                key={recordId}
                className="bg-white border rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-semibold text-lg">
                  {record.bookId?.title || "Unknown Book"}
                </h3>

                <p className="text-sm text-slate-600">
                  Due: {new Date(record.dueDate).toLocaleDateString()}
                </p>

                {/* ✅ RETURN BUTTON */}
                {isBorrowed ? (
                  <button
                    onClick={() => handleReturn(bookId)}
                    disabled={returningId === bookId}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                  >
                    {returningId === bookId
                      ? "Returning..."
                      : "Return Book"}
                  </button>
                ) : (
                  <p className="mt-3 text-green-600 font-semibold">
                    Returned ✅
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}