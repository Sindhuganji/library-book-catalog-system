import {
  useEffect,
  useState,
} from 'react';

import api from '../../services/api';

export default function ServerStatusBanner() {
  const [serverOk, setServerOk] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkServer = async () => {
    try {
      setChecking(true);
      await api.get("/health");
      setServerOk(true);
    } catch {
      setServerOk(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  if (serverOk) return null;

  return (
    <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2 text-sm flex items-center justify-between">
      <span>Server not connected</span>
      <button
        onClick={checkServer}
        disabled={checking}
        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
      >
        {checking ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
}