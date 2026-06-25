import { CATEGORIES } from '../utils/constants';

export default function FilterChips({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 -mx-1">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`
            whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200 tamil
            ${activeCategory === cat.key
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
              : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600 hover:border-brand-300'}
          `}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
