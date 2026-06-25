import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage('ithu_bookmarks', []);

  const isBookmarked = useCallback((guid) => {
    return bookmarks.some(b => b.guid === guid);
  }, [bookmarks]);

  const toggleBookmark = useCallback((article) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.guid === article.guid);
      if (exists) return prev.filter(b => b.guid !== article.guid);
      return [{ ...article, savedAt: new Date().toISOString() }, ...prev];
    });
  }, [setBookmarks]);

  const removeBookmark = useCallback((guid) => {
    setBookmarks(prev => prev.filter(b => b.guid !== guid));
  }, [setBookmarks]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, [setBookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearBookmarks };
}
