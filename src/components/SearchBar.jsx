import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={`
      relative flex items-center transition-all duration-200 rounded-2xl
      ${focused
        ? 'ring-2 ring-brand-600/30 shadow-md shadow-brand-600/5'
        : 'ring-1 ring-surface-200 dark:ring-surface-700'}
    `}>
      <Search size={18} className="absolute left-4 text-surface-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || 'செய்திகளை தேட...'}
        className="w-full bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100
          rounded-2xl py-3 pl-11 pr-10 text-sm outline-none tamil placeholder:text-surface-400"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); inputRef.current?.focus(); }}
          className="absolute right-3 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <X size={16} className="text-surface-400" />
        </button>
      )}
    </div>
  );
}
