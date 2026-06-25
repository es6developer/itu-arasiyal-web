import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllFeeds, clearCache } from '../services/rssService';
import { useLocalStorage } from './useLocalStorage';

const POLL_INTERVAL = 5 * 60 * 1000;

export function useNews(category = 'all') {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useLocalStorage('ithu_view_mode', 'swipe');
  const mountedRef = useRef(true);
  const pollRef = useRef(null);

  const load = useCallback(async (cat) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllFeeds(cat);
      if (mountedRef.current) {
        setArticles(data);
        setIsLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load(category);

    pollRef.current = setInterval(() => {
      if (mountedRef.current && category === 'all') {
        load(category);
      }
    }, POLL_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [category, load]);

  const refresh = useCallback(() => {
    clearCache();
    load(category);
  }, [category, load]);

  return {
    articles,
    isLoading,
    error,
    viewMode,
    setViewMode,
    refresh,
  };
}
