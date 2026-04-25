import {
  useEffect,
  useState,
} from 'react';

export default function TopLoadingBar() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => setLoading(Boolean(e.detail?.loading));
    window.addEventListener("api-loading", handler);
    return () => window.removeEventListener("api-loading", handler);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-1 z-[100] bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
        loading ? "w-full opacity-100" : "w-0 opacity-0"
      }`}
    />
  );
}