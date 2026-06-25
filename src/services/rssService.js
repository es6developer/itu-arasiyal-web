import { RSS_URLS, CORS_PROXIES, CACHE_DURATION } from '../utils/constants';
import { parseRSSItems, removeDuplicates, shuffleArray } from '../utils/helpers';

const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_DURATION) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
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
    throw new Error('No articles found from any feed');
  }

  articles = removeDuplicates(articles);
  articles.forEach(a => { a.category = a.category || category || 'all'; });
  return shuffleArray(articles);
}

export async function fetchSectionArticles(category) {
  return fetchAllFeeds(category);
}

export function clearCache() {
  cache.clear();
}
