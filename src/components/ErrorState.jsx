import { RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2 tamil">
        இணைப்பில் சிக்கல்
      </h3>
      <p className="text-surface-500 dark:text-surface-400 text-sm mb-6 max-w-sm">
        {message || 'செய்திகளை ஏற்ற முடியவில்லை. உங்கள் இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl
            hover:bg-brand-700 active:scale-95 transition-all duration-200 font-medium tamil"
        >
          <RefreshCw size={16} />
          மீண்டும் முயற்சி
        </button>
      )}
    </div>
  );
}
