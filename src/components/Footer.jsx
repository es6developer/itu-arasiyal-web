import { APP_NAME, APP_NAME_EN } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="இது அரசியல்" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 tamil">{APP_NAME}</p>
              <p className="text-[10px] text-surface-400">{APP_NAME_EN}</p>
            </div>
          </div>
          <p className="text-xs text-surface-400 dark:text-surface-500 text-center">
            &copy; {new Date().getFullYear()} {APP_NAME}.{' '}
            <span className="tamil">அரசியலை அறிந்து முடிவெடுங்கள்</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
