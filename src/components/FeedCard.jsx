import { useState } from 'react';
import { Heart, Share2, Bookmark, BookmarkCheck, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, truncate } from '../utils/helpers';

export default function FeedCard({ article, isBookmarked, onBookmark, onOpen, index, isActive }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasImage = !!article.imageUrl;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.title, url: article.link }); } catch {}
    } else {
      navigator.clipboard?.writeText(article.link);
    }
  };

  return (
    <div className={`
      swipe-item w-full flex-shrink-0 flex items-center justify-center px-3 py-2
      ${isActive ? 'z-10' : 'z-0'}
    `}>
      <div className={`
        w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl overflow-hidden
        transition-all duration-500
        ${isActive ? 'card-shadow-lg scale-100 opacity-100' : 'card-shadow scale-95 opacity-60'}
      `}>
        {hasImage ? (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-surface-200 dark:bg-surface-700 animate-pulse" />
            )}
            <img
              src={article.imageUrl}
              alt=""
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 gradient-overlay" />
          </div>
        ) : (
          <div className="h-20 bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              {article.source}
            </span>
            <span className="text-surface-400 text-xs">{formatDate(article.pubDate)}</span>
          </div>

          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 leading-snug mb-2 tamil">
            {article.title}
          </h2>

          <div className="relative">
            <p className={`text-surface-600 dark:text-surface-400 text-sm leading-relaxed tamil ${expanded ? '' : 'line-clamp-4'}`}>
              {article.description}
            </p>
            {article.description?.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-brand-600 dark:text-brand-400 text-xs font-medium mt-1 flex items-center gap-1 hover:underline"
              >
                {expanded ? 'குறைவாக காட்டு' : 'மேலும் படிக்க'}
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 px-4 py-3 border-t border-surface-100 dark:border-surface-700">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200
              ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={() => onBookmark(article)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200
              ${isBookmarked ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
          >
            {isBookmarked ? <BookmarkCheck size={18} fill="currentColor" /> : <Bookmark size={18} />}
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl
              hover:bg-brand-700 active:scale-95 transition-all duration-200 text-sm font-medium"
          >
            <ExternalLink size={16} />
            மூலம்
          </a>
        </div>
      </div>
    </div>
  );
}
