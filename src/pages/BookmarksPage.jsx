import { useState, useMemo, useCallback } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';

export default function BookmarksPage({ onOpenArticle }) {
  const { bookmarks, isBookmarked, toggleBookmark, clearBookmarks } = useBookmarks();
  const [showConfirm, setShowConfirm] = useState(false);

  const sorted = useMemo(() => {
    return [...bookmarks].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }, [bookmarks]);

  const handleBookmark = useCallback((article) => {
    toggleBookmark(article);
  }, [toggleBookmark]);

  const openArticle = useCallback((article) => {
    onOpenArticle(article, sorted);
  }, [onOpenArticle, sorted]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 tamil">சேமித்த செய்திகள்</h1>
          <p className="text-sm text-surface-500 mt-0.5 tamil">
            {bookmarks.length === 0 ? 'செய்திகள் எதுவும் இல்லை' : `${bookmarks.length} செய்திகள் சேமிக்கப்பட்டுள்ளன`}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors tamil"
          >
            <Trash2 size={16} />
            அனைத்தும் அழி
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="pt-16">
          <EmptyState
            icon={Bookmark}
            title="சேமித்த செய்திகள் இல்லை"
            subtitle="செய்தி அட்டையில் உள்ள புத்தகக்குறி ஐகானை அழுத்தி செய்திகளை சேமிக்கவும்"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {sorted.map((article, i) => (
            <div
              key={article.guid}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
            >
              <ArticleCard
                article={article}
                isBookmarked={true}
                onBookmark={handleBookmark}
                onOpen={openArticle}
              />
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-sm w-full animate-scale-in shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2 tamil">
              அனைத்து சேமிப்புகளையும் அழிக்கவா?
            </h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm mb-6 tamil">
              இதை செயல்தவிர்க்க முடியாது.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors tamil"
              >
                ரத்து
              </button>
              <button
                onClick={() => { clearBookmarks(); setShowConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors tamil"
              >
                அழி
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
