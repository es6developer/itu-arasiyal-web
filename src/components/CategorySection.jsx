export default function CategorySection({ title, titleEn, children, showAd = false }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 tamil">{title}</h2>
          {titleEn && (
            <p className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider font-medium">{titleEn}</p>
          )}
        </div>
        <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700 hidden sm:block" />
      </div>
      {children}
      {showAd && (
        <div className="mt-8 py-4 border-t border-surface-200 dark:border-surface-700">
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl h-20 flex items-center justify-center">
            <p className="text-xs text-surface-400">Advertisement</p>
          </div>
        </div>
      )}
    </section>
  );
}
