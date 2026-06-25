import { useState } from 'react';
import { Heart, Bookmark, BookmarkCheck, Share2, Clock } from 'lucide-react';
import { formatDate, truncate } from '../utils/helpers';

export default function ArticleCard({ article, isBookmarked, onBookmark, onOpen, size = 'default' }) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImage = !!article.imageUrl && !imgError;

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.title, url: article.link }); } catch {}
    } else {
      navigator.clipboard?.writeText(article.link);
    }
  };

  const isHero = size === 'hero';

  return (
    <article
      onClick={() => onOpen(article)}
      className={`
        group bg-white dark:bg-surface-800 rounded-xl overflow-hidden
        transition-all duration-200 cursor-pointer
        card-shadow hover:card-shadow-hover
        ${isHero ? 'lg:col-span-2 lg:row-span-2' : ''}
      `}
    >
      {hasImage && (
        <div className={`relative overflow-hidden ${isHero ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-surface-100 dark:bg-surface-700 animate-pulse" />
          )}
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-500
              group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className={`${isHero ? 'p-5 lg:p-6' : 'p-4'}`}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded">
            {article.source}
          </span>
          <span className="text-[11px] text-surface-400 dark:text-surface-500 flex items-center gap-1">
            <Clock size={10} />
            {formatDate(article.pubDate)}
          </span>
        </div>

        <h3 className={`font-bold text-surface-900 dark:text-surface-100 leading-snug tamil
          ${isHero ? 'text-xl lg:text-2xl' : 'text-[15px]'}
          ${hasImage ? '' : 'line-clamp-3'}
        `}>
          {article.title}
        </h3>

        {!hasImage && article.description && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed line-clamp-2 tamil">
            {truncate(article.description, isHero ? 200 : 120)}
          </p>
        )}

        {isHero && hasImage && article.description && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed line-clamp-2 tamil">
            {truncate(article.description, 150)}
          </p>
        )}

        <div className="flex items-center gap-1 mt-3 -ml-1.5">
          <button
            onClick={e => { e.stopPropagation(); setLiked(!liked); }}
            className={`p-1.5 rounded-lg transition-colors ${
              liked ? 'text-red-500' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <Share2 size={15} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onBookmark(article); }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={15} fill="currentColor" /> : <Bookmark size={15} />}
          </button>
        </div>
      </div>
    </article>
  );
}
