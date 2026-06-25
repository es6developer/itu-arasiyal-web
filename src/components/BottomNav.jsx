import { Home, AlertTriangle, Search, Bookmark } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'home', label: 'முகப்பு', icon: Home },
    { key: 'breaking', label: 'பிரேக்கிங்', icon: AlertTriangle },
    { key: 'search', label: 'தேடல்', icon: Search },
    { key: 'bookmarks', label: 'சேமித்தவை', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden
      bg-white/90 dark:bg-surface-800/90 backdrop-blur-lg
      border-t border-surface-200 dark:border-surface-700
      safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-16 rounded-lg transition-all duration-200 tamil
              ${activeTab === key
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-surface-400 dark:text-surface-500 hover:text-surface-600'}`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
