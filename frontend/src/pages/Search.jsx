// src/pages/Search.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader2, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function Search() {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q) => {
    if (!q || q.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}&limit=30`);
      setResults(res.data?.results || []);
    } catch (_) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const typeLabel = (type) => ({
    team: 'Team',
    program: 'Program',
    project: 'Project',
    blog: 'Article',
    event: 'Event',
  }[type] || type);

  const typeColor = (type) => ({
    team: '#064B7A',
    program: '#8BCB2A',
    project: '#F39C12',
    blog: '#9B59B6',
    event: '#16A085',
  }[type] || '#6D7E89');

  return (
    <div className="section bg-[#F5F9FB] min-h-[70vh]">
      <div className="container-ncg max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-3">
            Search NCG
          </h1>
          <p className="text-[#6D7E89]">
            Find team members, programs, projects, articles, and events.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6D7E89]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-14 pr-32 py-4 rounded-2xl border border-[#EDF2F5] bg-white text-base focus:outline-none focus:border-[#8BCB2A] shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#A8D94A] text-sm"
          >
            Search
          </button>
        </form>

        {/* States */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin mx-auto" />
            <p className="text-sm text-[#6D7E89] mt-3">Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#EDF2F5] rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-[#A8BBC5]" />
            </div>
            <p className="text-sm text-[#6D7E89]">
              No results found for "<strong>{query}</strong>". Try different keywords.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-sm text-[#6D7E89] mb-4">
              Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "
              <strong>{query}</strong>"
            </p>
            <ul className="space-y-3">
              {results.map((r, i) => (
                <li key={`${r.type}-${r.id || i}`}>
                  <Link
                    to={r.url}
                    className="group bg-white border border-[#EDF2F5] rounded-xl p-5 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                      style={{
                        background: `${typeColor(r.type)}15`,
                        color: typeColor(r.type),
                      }}
                    >
                      {typeLabel(r.type).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: `${typeColor(r.type)}15`,
                            color: typeColor(r.type),
                          }}
                        >
                          {typeLabel(r.type)}
                        </span>
                        {r.subtitle && (
                          <span className="text-xs text-[#6D7E89] truncate">{r.subtitle}</span>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-base text-[#031B2A] group-hover:text-[#064B7A]">
                        {r.title}
                      </h3>
                      {r.excerpt && (
                        <p className="text-sm text-[#6D7E89] mt-1 line-clamp-2">{r.excerpt}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A8BBC5] group-hover:text-[#8BCB2A] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {!searched && !loading && (
          <div className="text-center py-16">
            <p className="text-sm text-[#6D7E89]">
              Try searching for <em>bootcamp</em>, <em>irrigation</em>, or <em>innovation</em>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}