import { Home, AlertTriangle, Search, Bookmark, Menu, X, Moon, Sun } from 'lucide-react';
import { APP_NAME, TAGLINE } from '../utils/constants';

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, darkMode, toggleDarkMode }) {
  const tabs = [
    { key: 'home', label: 'முகப்பு', labelEn: 'Home', icon: Home },
    { key: 'breaking', label: 'பிரேக்கிங்', labelEn: 'Breaking', icon: AlertTriangle },
    { key: 'search', label: 'தேடல்', labelEn: 'Search', icon: Search },
    { key: 'bookmarks', label: 'சேமித்தவை', labelEn: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-72 z-50
        bg-white dark:bg-surface-800
        border-r border-surface-200 dark:border-surface-700
        transform transition-transform duration-300 ease-out
        lg:transform-none lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="gradient-brand p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-xl font-bold tamil">{APP_NAME}</h1>
                <p className="text-white/70 text-xs mt-1 tamil">{TAGLINE}</p>
              </div>
              <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {tabs.map(({ key, label, labelEn, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { onTabChange(key); onClose?.(); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 tamil
                  ${activeTab === key
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}
                `}
              >
                <Icon size={20} />
                <span>{label}</span>
                <span className="text-xs text-surface-400 ml-auto">{labelEn}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700
                transition-all duration-200"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="tamil">{darkMode ? 'லைட் மோட்' : 'டார்க் மோட்'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
