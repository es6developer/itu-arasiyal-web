import { RSS_URLS, CORS_PROXIES, CACHE_DURATION } from '../utils/constants';
import { parseRSSItems, removeDuplicates, shuffleArray } from '../utils/helpers';

const cache = new Map();
const OFFLINE_KEY = 'itu-arasiyal-offline-articles';
const MAX_OFFLINE = 50;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_DURATION) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

function saveOffline(articles) {
  try {
    const existing = getOfflineArticles();
    const merged = [...articles, ...existing];
    const unique = removeDuplicates(merged).slice(0, MAX_OFFLINE);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(unique));
  } catch (e) {
    console.warn('[rss] offline save failed:', e.message);
  }
}

export function getOfflineArticles() {
  try {
    const data = localStorage.getItem(OFFLINE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isOfflineAvailable() {
  return getOfflineArticles().length > 0;
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function fetchRSS(url, retries = 1) {
  const cached = getCached(url);
  if (cached) return cached;

  for (const proxy of CORS_PROXIES) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const proxyUrl = proxy(url);
        console.log('[rss] fetching', proxyUrl);
        const res = await fetchWithTimeout(proxyUrl, 15000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        console.log('[rss] got', text.length, 'bytes from', url);
        if (!text.includes('<item>') && !text.includes('<entry>')) {
          throw new Error('Not valid RSS: ' + text.slice(0, 200));
        }
        setCache(url, text);
        return text;
      } catch (err) {
        console.warn('[rss] attempt', attempt + 1, 'failed for', url, err.message);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }
  throw new Error(`Failed to fetch: ${url}`);
}

export async function fetchAllFeeds(category = 'all') {
  const urls = RSS_URLS[category] || RSS_URLS.all;
  console.log('[rss] loading category:', category, 'urls:', urls.length);

  const results = await Promise.allSettled(
    urls.map(url => fetchRSS(url).then(text => {
      const items = parseRSSItems(text);
      console.log('[rss] parsed', items.length, 'items from', url);
      return items;
    }))
  );

  let articles = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles = articles.concat(result.value);
    } else {
      console.warn('[rss] feed failed:', result.reason?.message);
    }
  }

  console.log('[rss] total articles:', articles.length);

  if (articles.length === 0) {
    const offline = getOfflineArticles();
    if (offline.length > 0) {
      console.log('[rss] using offline cache:', offline.length, 'articles');
      return offline;
    }
    throw new Error('No articles found from any feed');
  }

  articles = removeDuplicates(articles);
  articles.forEach(a => { a.category = a.category || category || 'all'; });
  const shuffled = shuffleArray(articles);
  saveOffline(shuffled);
  return shuffled;
}

export async function fetchSectionArticles(category) {
  return fetchAllFeeds(category);
}

export function clearCache() {
  cache.clear();
}
