import { useState, useEffect, useRef } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function BreakingTicker({ articles, onSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!articles || articles.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mb-6 bg-white dark:bg-surface-800 rounded-xl card-shadow overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-red-600 text-white">
          <Zap size={14} className="animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
        </div>
        <div className="flex-1 overflow-hidden px-4 py-3">
          {articles.map((article, i) => (
            <button
              key={article.guid}
              onClick={() => onSelect(article)}
              className={`text-sm font-medium text-surface-800 dark:text-surface-200 tamil line-clamp-1 transition-opacity duration-300 ${
                i === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
              }`}
            >
              {article.title}
            </button>
          ))}
        </div>
        <div className="flex-shrink-0 px-3">
          <div className="flex gap-1">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-red-500' : 'bg-surface-300 dark:bg-surface-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
