import { useState, useEffect, useCallback } from 'react';
import { X, Heart, Share2, Bookmark, BookmarkCheck, ExternalLink, Clock, Globe } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function ArticleView({ article, isBookmarked, onBookmark, onClose }) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.title, url: article.link }); } catch {}
    } else {
      navigator.clipboard?.writeText(article.link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[92vh] bg-white dark:bg-surface-800 rounded-t-3xl overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-surface-800 pt-4 pb-2 px-4 flex items-center justify-between border-b border-surface-100 dark:border-surface-700">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <X size={20} className="text-surface-600 dark:text-surface-300" />
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-xl transition-all ${liked ? 'text-red-500' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => onBookmark(article)}
              className={`p-2 rounded-xl transition-all ${isBookmarked ? 'text-brand-600' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        <div className="px-5 pb-8">
          {article.imageUrl && (
            <div className="relative w-full mt-4 rounded-2xl overflow-hidden" style={{ paddingTop: '52%' }}>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-surface-200 dark:bg-surface-700 animate-pulse" />
              )}
              <img
                src={article.imageUrl}
                alt=""
                onLoad={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-5 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-full">
              {article.source}
            </span>
            <span className="text-surface-400 text-xs flex items-center gap-1">
              <Clock size={12} />
              {formatDate(article.pubDate)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 leading-tight mb-4 tamil">
            {article.title}
          </h1>

          <div className="prose prose-sm dark:prose-invert max-w-none tamil">
            {article.description.split('\n').map((para, i) => (
              <p key={i} className="text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-brand-600 text-white rounded-2xl
              hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 font-medium tamil"
          >
            <Globe size={18} />
            மூல செய்தியை படிக்க
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
