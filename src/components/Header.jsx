import { useState, useRef, useEffect } from 'react';
import { Menu, X, Bookmark, Search, Moon, Sun, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react';
import { APP_NAME, CATEGORIES } from '../utils/constants';

const PRIMARY_CATS = ['all', 'politics', 'tamil_nadu', 'india', 'cinema', 'sports', 'technology', 'business', 'lifestyle', 'spiritual'];

export default function Header({ activeTab, onTabChange, darkMode, toggleDarkMode, onSearchToggle, onBookmarks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el?.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  const primaryCats = CATEGORIES.filter(c => PRIMARY_CATS.includes(c.key));

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <div className="flex items-center gap-3 lg:gap-6">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <a href="/" className="flex items-center gap-2.5" onClick={e => { e.preventDefault(); onTabChange('all'); }}>
              <img src="/logo.png" alt="இது அரசியல்" className="h-9 w-9 rounded-lg object-cover" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-surface-900 dark:text-surface-100 leading-tight tamil">{APP_NAME}</h1>
                <p className="text-[10px] text-surface-400 leading-tight tracking-wide">Tamil Political News</p>
              </div>
            </a>
            {isOffline && (
              <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium">
                <WifiOff size={10} />
                Offline
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onSearchToggle}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              title="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={onBookmarks}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === 'bookmarks'
                  ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
              title="Bookmarks"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav - horizontal scroll */}
      <div className="relative border-t border-surface-100 dark:border-surface-800">
        {showLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-white dark:from-surface-900 to-transparent flex items-center justify-center"
          >
            <ChevronLeft size={16} className="text-surface-500" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide max-w-7xl mx-auto px-4 lg:px-6"
        >
          {primaryCats.map(cat => (
            <button
              key={cat.key}
              onClick={() => onTabChange(cat.key)}
              className={`flex-shrink-0 px-3 py-2.5 text-[13px] font-medium transition-colors tamil whitespace-nowrap ${
                activeTab === cat.key
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 border-b-2 border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {showRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white dark:from-surface-900 to-transparent flex items-center justify-center"
          >
            <ChevronRight size={16} className="text-surface-500" />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {CATEGORIES.map(item => (
              <button
                key={item.key}
                onClick={() => { setMenuOpen(false); onTabChange(item.key); }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors tamil ${
                  activeTab === item.key
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
              <button
                onClick={() => { setMenuOpen(false); onBookmarks(); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors tamil"
              >
                <Bookmark size={16} className="inline mr-2" />
                சேமித்தவை
              </button>
              <button
                onClick={() => { setMenuOpen(false); onSearchToggle(); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors tamil"
              >
                <Search size={16} className="inline mr-2" />
                தேடல்
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
