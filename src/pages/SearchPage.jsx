import { useState, useMemo, useCallback } from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const TRENDING_SEARCHES = ['திமுக', 'அதிமுக', 'தவெக', 'பாஜக', 'ஸ்டாலின்', 'மோடி', 'சென்னை', 'தேர்தல்'];

export default function SearchPage({ onOpenArticle }) {
  const [query, setQuery] = useState('');
  const { articles, isLoading } = useNews('all');
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [searchHistory, setSearchHistory] = useLocalStorage('ithu_search_history', []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q)
    );
  }, [articles, query]);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    if (q.trim() && !searchHistory.includes(q.trim())) {
      setSearchHistory(prev => [q.trim(), ...prev].slice(0, 10));
    }
  }, [searchHistory, setSearchHistory]);

  const handleBookmark = useCallback((article) => {
    toggleBookmark(article);
  }, [toggleBookmark]);

  const openArticle = useCallback((article) => {
    onOpenArticle(article, results.length > 0 ? results : articles);
  }, [onOpenArticle, results, articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-4 tamil">தேடல்</h1>
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="செய்திகள், தலைப்புகள், கட்டுரைகள்..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all tamil"
            autoFocus
          />
        </div>
      </div>

      {!query && searchHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3 flex items-center gap-2">
            <Clock size={14} />
            சமீபத்திய தேடல்கள்
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, i) => (
              <button
                key={i}
                onClick={() => handleSearch(term)}
                className="px-3 py-1.5 text-sm bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors tamil"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3 flex items-center gap-2">
            <TrendingUp size={14} />
            பிரபல தேடல்கள்
          </h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term, i) => (
              <button
                key={i}
                onClick={() => handleSearch(term)}
                className="px-3 py-1.5 text-sm bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors tamil"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && isLoading && (
        <div className="pt-16"><LoadingSpinner /></div>
      )}

      {query && !isLoading && results.length === 0 && (
        <div className="pt-16">
          <EmptyState
            icon={Search}
            title="முடிவுகள் இல்லை"
            subtitle={`'${query}' உடன் பொருந்தும் செய்திகள் எதுவும் இல்லை`}
          />
        </div>
      )}

      {query && !isLoading && results.length > 0 && (
        <div>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-5 tamil">
            {results.length} முடிவுகள் காணப்பட்டன
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {results.map((article, i) => (
              <div
                key={article.guid}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                <ArticleCard
                  article={article}
                  isBookmarked={isBookmarked(article.guid)}
                  onBookmark={handleBookmark}
                  onOpen={openArticle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
