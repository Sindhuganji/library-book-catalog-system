import {
  useEffect,
  useState,
} from 'react';

import { useParams } from 'react-router-dom';

import Spinner from '../components/common/Spinner';
import Toast from '../components/Toast';
import api from '../services/api';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [toast, setToast] = useState({ type: "success", message: "" });

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.message || "Failed to load book details" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      await api.post(`/borrow/${id}`);
      setToast({ type: "success", message: "Book borrowed successfully" });
      await fetchBook();
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.message || "Borrow failed" });
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <Spinner text="Loading book details..." />;
  if (!book) return <p className="text-red-600">Book not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white border shadow rounded-xl p-6">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, message: "" })} />
      <h2 className="text-2xl font-bold mb-3">{book.title}</h2>
      <p className="text-slate-600"><span className="font-medium">Author:</span> {book.author}</p>
      <p className="text-slate-600"><span className="font-medium">Category:</span> {book.category}</p>
      <p className="text-slate-700 mt-4">{book.description || "No description available."}</p>
      <p className="mt-4">
        <span className="font-medium">Status:</span>{" "}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            book.availabilityStatus === "available"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {book.availabilityStatus}
        </span>
      </p>

      <button
        onClick={handleBorrow}
        disabled={book.availabilityStatus !== "available" || borrowing}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-60"
      >
        {borrowing ? "Borrowing..." : "Borrow"}
      </button>
    </div>
  );
}