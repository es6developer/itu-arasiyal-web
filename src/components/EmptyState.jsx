export default function EmptyState({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <Icon size={32} className="text-surface-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-1 tamil">
        {title || 'எதுவும் இல்லை'}
      </h3>
      {subtitle && (
        <p className="text-surface-500 dark:text-surface-400 text-sm tamil">{subtitle}</p>
      )}
    </div>
  );
}
