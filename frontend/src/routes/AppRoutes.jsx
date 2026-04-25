import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Footer from '../components/common/Footer';
import ServerStatusBanner from '../components/common/ServerStatusBanner';
import TopLoadingBar from '../components/common/TopLoadingBar';
import { useAuth } from '../context/AuthContext';
import Admin from '../pages/Admin';
import BookDetails from '../pages/BookDetails';
import Books from '../pages/Books';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminRoute from './AdminRoute';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-indigo-600">Library Catalog</h1>
        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link className="hover:text-indigo-600 transition" to="/books">Books</Link>
              <Link className="hover:text-indigo-600 transition" to="/dashboard">Dashboard</Link>
              {user?.role === "admin" && (
                <Link className="hover:text-indigo-600 transition" to="/admin">Admin Panel</Link>
              )}
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hover:text-indigo-600 transition" to="/login">Login</Link>
              <Link className="hover:text-indigo-600 transition" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopLoadingBar />
      <ServerStatusBanner />
      <Navbar />
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}