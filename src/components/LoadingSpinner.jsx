export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-surface-200 dark:border-surface-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-600 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-surface-400 dark:text-surface-500 text-sm tamil">செய்திகள் ஏற்றப்படுகின்றன...</p>
    </div>
  );
}
