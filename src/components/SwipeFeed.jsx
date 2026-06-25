import { useRef, useState, useCallback, useEffect } from 'react';
import FeedCard from './FeedCard';

export default function SwipeFeed({ articles, isBookmarked, onBookmark, onOpen }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const scrollTo = useCallback((index) => {
    if (index < 0 || index >= articles.length || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [articles.length, isTransitioning]);

  const handleWheel = useCallback((e) => {
    if (isTransitioning) return;
    if (e.deltaY > 30) scrollTo(activeIndex + 1);
    else if (e.deltaY < -30) scrollTo(activeIndex - 1);
  }, [activeIndex, scrollTo, isTransitioning]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    const diff = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(diff) > 10) isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) scrollTo(activeIndex + 1);
    else if (diff < -50) scrollTo(activeIndex - 1);
    isDragging.current = false;
  };

  if (!articles.length) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-hidden select-none no-touch-callout"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-full h-full transition-transform duration-400 ease-out"
        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
      >
        {articles.map((article, i) => (
          <FeedCard
            key={article.guid}
            article={article}
            isBookmarked={isBookmarked(article.guid)}
            onBookmark={onBookmark}
            onOpen={onOpen}
            index={i}
            isActive={i === activeIndex}
          />
        ))}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {articles.slice(0, Math.min(articles.length, 20)).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-6 bg-brand-600'
                : 'w-1.5 bg-white/60 dark:bg-surface-500'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <span className="text-xs text-surface-400 bg-white/80 dark:bg-surface-800/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {articles.length}
        </span>
      </div>
    </div>
  );
}
