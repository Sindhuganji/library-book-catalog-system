import {
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

export default function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  const [bookForm, setBookForm] = useState({
  title: "",
  author: "",
  category: "",
  description: "",
  totalCopies: 1
});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      const usersRes = await api.get("/admin/users");

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD BOOK FUNCTION
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books", bookForm);

      alert("Book added successfully ✅");

      setBookForm({
        title: "",
        author: "",
        category: "",
        description: ""
      });

      fetchData(); // refresh stats
    } catch (err) {
      alert("Failed to add book ❌");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card title="Users" value={stats.totalUsers} />
        <Card title="Books" value={stats.totalBooks} />
        <Card title="Borrowed" value={stats.borrowedBooks} />
        <Card
  title="Returned"
  value={(stats.totalBooks || 0) - (stats.borrowedBooks || 0)}
/>
      </div>

      {/* 🔹 ADD BOOK FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Book</h3>

        <form onSubmit={handleAddBook} className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Title"
            value={bookForm.title}
            onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Author"
            value={bookForm.author}
            onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Category"
            value={bookForm.category}
            onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            value={bookForm.description}
            onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
          />
          <input
  type="number"
  min="1"
  className="w-full border px-3 py-2 rounded"
  placeholder="Total Copies"
  value={bookForm.totalCopies}
  onChange={(e) =>
    setBookForm({ ...bookForm, totalCopies: e.target.value })
  }
/>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Add Book
          </button>
        </form>
      </div>

      {/* 🔹 USERS TABLE */}
      <h3 className="text-xl font-semibold mb-3">Users</h3>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-xl font-bold">{value || 0}</p>
    </div>
  );
}