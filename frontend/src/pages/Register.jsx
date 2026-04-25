import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHandler';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/login");
    } catch (error) {
      setApiError(getErrorMessage(error, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-1">Register</h2>
        <p className="text-sm text-slate-500 mb-6">Create your account</p>
        {apiError && <p className="text-sm text-red-600 mb-3">{apiError}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <input className="w-full border rounded-lg px-3 py-2" type="password" placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </div>
    </div>
  );
}