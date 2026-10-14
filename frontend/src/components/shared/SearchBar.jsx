// src/components/shared/SearchBar.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ctrl+K to open
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}&limit=8`);
        setResults(res.data?.results || []);
      } catch (_) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, open]);

  const goTo = (url) => {
    setOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <>
      {/* Trigger button (in header) */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#EDF2F5] text-sm text-[#6D7E89] hover:border-[#8BCB2A] hover:text-[#064B7A] transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="text-xs">Search</span>
        <kbd className="hidden lg:inline-block text-[10px] bg-[#F5F9FB] px-1.5 py-0.5 rounded border border-[#EDF2F5] text-[#6D7E89]">
          ⌘K
        </kbd>
      </button>

      {/* Mobile icon-only button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-[#F5F9FB]"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 text-[#064B7A]" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EDF2F5]">
              <SearchIcon className="w-5 h-5 text-[#6D7E89]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    goTo(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
                placeholder="Search NCG..."
                className="flex-1 outline-none text-base bg-transparent"
              />
              {loading && <Loader2 className="w-4 h-4 text-[#8BCB2A] animate-spin" />}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#F5F9FB]"
              >
                <X className="w-4 h-4 text-[#6D7E89]" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="p-6 text-center text-sm text-[#6D7E89]">
                  Type at least 2 characters to search
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="p-6 text-center text-sm text-[#6D7E89]">
                  No results for "<strong>{query}</strong>"
                </div>
              ) : (
                <ul>
                  {results.map((r, i) => (
                    <li key={i}>
                      <button
                        onClick={() => goTo(r.url)}
                        className="w-full text-left px-5 py-3 hover:bg-[#F5F9FB] transition-colors flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#6CA51A] uppercase">
                          {r.type?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#031B2A] truncate">{r.title}</p>
                          {r.excerpt && (
                            <p className="text-xs text-[#6D7E89] truncate">{r.excerpt}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                  {query.trim() && (
                    <li className="border-t border-[#EDF2F5]">
                      <button
                        onClick={() => goTo(`/search?q=${encodeURIComponent(query)}`)}
                        className="w-full text-left px-5 py-3 hover:bg-[#F5F9FB] text-sm font-semibold text-[#064B7A]"
                      >
                        See all results for "{query}" →
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}